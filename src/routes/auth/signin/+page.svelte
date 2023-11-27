<script lang="ts">
	import Icon from '@iconify/svelte';
	export let data;
	let { supabase, session } = data;
	$: {
		({ supabase, session } = data);
	}

	async function handleSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		console.log(email, password);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		console.log(data, error);
		if (error) {
			alert(error.message || '로그인에 실패했습니다.');
			return;
		}
		console.log('data', data);
		const { data: user } = await supabase
			.from('User')
			.select('*')
			.eq('id', data?.user?.id)
			.single();
		console.log('user', user);
		if (user!.is_confirmed) {
			window.location.href = '/';
		} else {
			alert('관리자 승인 대기중입니다.');
			return;
		}
		// const { user } = await fetch('/auth/signin', {
		// 	method: 'POST'
		// }).then((resp) => resp.json());
		// console.log('user', user);
		// console.log('isConfirmed', user.isConfirmed);
		// if (user.isConfirmed) {
		// 	window.location.href = '/';
		// } else {
		// 	alert('관리자 승인 대기중입니다.');
		// 	return;
		// }
	}
</script>

<svelte:head>
	<!-- <title>Home</title> -->
	<meta name="로그인" content="에이스프렙 SAT 모의고사" />
</svelte:head>

<form class="p-4 flex flex-col items-stretch gap-4" on:submit|preventDefault={handleSubmit}>
	<h2 class=" text-center font-semibold text-gray-600">에이스프렙 SAT 모의고사</h2>
	<h2 class=" text-center font-semibold text-xl text-gray-700">로그인</h2>
	<div>
		<label for="email" class="block mb-2 text-sm font-medium text-gray-600">E-Mail</label>
		<div class="flex">
			<span
				class="inline-flex items-center px-3 text-sm text-gray-900 bg-[#81A5C3] border border-r-0 border-gray-300 rounded-l-md"
			>
				<div class="w-4 h-4">
					<Icon icon="gridicons:mail" class="w-full h-full text-white" />
				</div>
			</span>
			<input
				type="email"
				id="email"
				name="email"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="johndoe@gmail.com"
			/>
		</div>
	</div>
	<div>
		<label for="password" class="block mb-2 text-sm font-medium text-gray-600">Password</label>
		<div class="flex">
			<span
				class="inline-flex items-center px-3 text-sm text-gray-900 bg-[#81A5C3] border border-r-0 border-gray-300 rounded-l-md"
			>
				<div class="w-4 h-4">
					<Icon icon="mdi:password" class="w-full h-full text-white" />
				</div>
			</span>
			<input
				type="password"
				id="password"
				name="password"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="비밀번호를 입력하세요"
			/>
		</div>
	</div>
	<button class="p-2 rounded text-white bg-[#81A5C3] hover:bg-[#91B5D3]">로그인</button>
	<a href="/auth/signup" class="text-gray-500 hover:text-sky-500 text-sm text-center"
		>아직 회원이 아니신가요? 회원가입 하러가기</a
	>
</form>
