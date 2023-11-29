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
		const password = formData.get('password') as string;
		const password2 = formData.get('password2') as string;
		if (password !== password2) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		const { success } = await fetch('/auth/passwordchange', {
			method: 'POST',
			body: JSON.stringify({ password })
		}).then((resp) => resp.json());
		if (success) {
			window.location.href = '/';
		} else {
			alert('패스워드 변경에 실패했습니다.');
			return;
		}
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
				placeholder="새 비밀번호를 입력하세요"
			/>
		</div>
	</div>
	<div>
		<label for="password2" class="block mb-2 text-sm font-medium text-gray-600">Password</label>
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
				id="password2"
				name="password2"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="새 비밀번호를 다시 입력하세요"
			/>
		</div>
	</div>
	<button class="p-2 rounded text-white bg-[#81A5C3] hover:bg-[#91B5D3]">비밀번호 변경</button>
</form>
