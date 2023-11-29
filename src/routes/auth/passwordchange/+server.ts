import { supabase } from '$lib/server/ServerSupabase';
import { json, redirect } from '@sveltejs/kit';

export const POST = async ({ request, url, locals: { getSession } }) => {
	// const name = url.searchParams.get('name');
	const body = await request.json();
	console.log('/auth/passwordchange POST', body);

	const session = await getSession();
	console.log('session', session);
	if (!session) {
		return json({ success: false, message: 'Not logged in' });
	}

	supabase.auth.admin.updateUserById(session.user.id, {
		password: body.password
	});

	return json({ success: true });
};
