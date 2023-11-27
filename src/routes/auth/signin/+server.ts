import prisma from '$lib/prisma.js';
import { json, redirect } from '@sveltejs/kit';

export const POST = async ({ request, url, locals: { supabase, getSession } }) => {
	// const name = url.searchParams.get('name');
	// const body = await request.json();
	console.log('/auth/signin POST');
	const session = await getSession();
	console.log('session', session);
	const user = await prisma.user.findUnique({
		where: {
			id: session!.user.id
		}
	});
	console.log('user', user);
	console.log('isConfirmed', user?.isConfirmed);

	return json({ user });
};
