// src/hooks.server.js
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = (await event.locals.supabase.auth.getSession()) as { data: { session: Session | null } };
		return session;
	};
	// console.log('event.url.pathname', event.url.pathname);

	if (!event.url.pathname.startsWith('/auth')) {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		console.log('session', session);

		if (!session) {
			throw redirect(303, '/auth/signin');
		}
		const { data: user } = await event.locals.supabase
			.from('User')
			.select('*')
			.eq('id', session.user.id)
			.single();

		if (user && !user.is_confirmed) {
			throw redirect(303, '/auth/signin');
		}
		event.locals.user = user!;
		return resolve(event, {
			filterSerializedResponseHeaders(name) {
				return name === 'content-range';
			}
		});
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
