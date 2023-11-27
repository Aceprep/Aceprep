import { supabase } from '$lib/server/ServerSupabase';
import { error, json } from '@sveltejs/kit';

export async function DELETE({ request, locals: { getSession } }) {
	const { userId } = await request.json();
	const session = await getSession();
	console.log('session', session);

	if (!session) throw new Error('No session');
	if (session.user.email === 'admin@aceprep.co.kr') {
		console.log('userId', userId);

		const { data, error } = await supabase.auth.admin.deleteUser(userId);
		console.log('deleted', data, error);
		if (error) throw new Error(error.message);
		return json({ message: 'DELETED' });
	}
	throw 'Not admin authorized';
}
