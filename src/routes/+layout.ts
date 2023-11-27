import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import type { Database } from '$lib/types/database.types.js';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				refetchOnWindowFocus: false
			}
		}
	});

	return { supabase, session, queryClient, user: data.user };
};
