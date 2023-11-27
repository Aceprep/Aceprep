import prisma from '$lib/prisma.js';
import { json, redirect } from '@sveltejs/kit';

export const POST = async ({ request, url, locals: { supabase } }) => {
	// const name = url.searchParams.get('name');
	const body = await request.json();
	console.log('/auth/signup POST', body);
	const newManager = await prisma.user.create({
		data: {
			id: body.uid,
			name: body.name,
			phone: body.phone,
			email: body.email,
			isTeacher: body.isTeacher
		}
	});

	return json({ newManager });
};
