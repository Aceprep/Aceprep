// src/routes/+layout.server.ts
export const load = async ({ locals: { getSession, user } }) => {
	// console.log('layout server', user);
	//* 알았다!! 여기서 클라이언트한테 뭐 줄지를 결정한다!!
	return {
		session: await getSession(),
		user
	};
};
