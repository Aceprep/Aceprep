<script lang="ts">
	import Icon from '@iconify/svelte';
	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
	let opp = { email: '' };
	async function handleSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordagain = formData.get('passwordagain') as string;
		const name = formData.get('name') as string;
		const phone = formData.get('phone') as string;

		const is_teacher = formData.get('isTeacher') == 'true' ? true : false;
		if (password !== passwordagain) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}
		console.log(email, password);
		console.log(name, phone, is_teacher);

		const signupResp = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
					phone,
					is_teacher
				}
			}
		});
		console.log('signup data', signupResp);
		if (signupResp.error) {
			alert(signupResp.error.message);
			return;
		}
		alert('회원가입이 완료되었습니다.');
		location.href = '/auth/signin';
	}
</script>

<svelte:head>
	<meta name="로그인" content="에이스프렙 SAT 모의고사" />
</svelte:head>

<form class="p-4 flex flex-col items-stretch gap-4" on:submit|preventDefault={handleSubmit}>
	<h2 class=" text-center font-semibold text-gray-600">에이스프렙 SAT 모의고사</h2>
	<h2 class=" text-center font-semibold text-xl text-gray-700">회원가입</h2>
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
	<div>
		<label for="passwordagain" class="block mb-2 text-sm font-medium text-gray-600"
			>Password 확인</label
		>
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
				id="passwordagain"
				name="passwordagain"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="다시 한번 비밀번호를 입력하세요"
			/>
		</div>
	</div>
	<div>
		<label for="bordered-radio" class="block mb-2 text-sm font-medium text-gray-600"
			>회원 타입</label
		>
		<div class="flex justify-stretch w-full gap-2">
			<div class="flex-1 flex items-center pl-4 border border-gray-200 rounded">
				<input
					id="bordered-radio-1"
					type="radio"
					value={false}
					name="isTeacher"
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
				/>
				<label for="bordered-radio-1" class="w-full py-4 ml-2 text-sm font-medium text-gray-900"
					>학생</label
				>
			</div>
			<div class="flex-1 flex items-center pl-4 border border-gray-200 rounded">
				<input
					checked
					id="bordered-radio-2"
					type="radio"
					value={true}
					name="isTeacher"
					class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
				/>
				<label for="bordered-radio-2" class="w-full py-4 ml-2 text-sm font-medium text-gray-900"
					>선생님</label
				>
			</div>
		</div>
	</div>
	<div>
		<label for="name" class="block mb-2 text-sm font-medium text-gray-600">이름</label>
		<div class="flex">
			<span
				class="inline-flex items-center px-3 text-sm text-gray-900 bg-[#81A5C3] border border-r-0 border-gray-300 rounded-l-md"
			>
				<div class="w-4 h-4">
					<Icon icon="mdi:user" class="w-full h-full text-white" />
				</div>
			</span>
			<input
				type="text"
				id="name"
				name="name"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="이름을 입력하세요"
			/>
		</div>
	</div>

	<div>
		<label for="phone" class="block mb-2 text-sm font-medium text-gray-600">전화번호</label>
		<div class="flex">
			<span
				class="inline-flex items-center px-3 text-sm text-gray-900 bg-[#81A5C3] border border-r-0 border-gray-300 rounded-l-md"
			>
				<div class="w-4 h-4">
					<Icon icon="ant-design:phone-filled" class="w-full h-full text-white" />
				</div>
			</span>
			<input
				type="number"
				id="phone"
				name="phone"
				class="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
				placeholder="전화번호를 입력하세요"
			/>
		</div>
	</div>
	<button class="p-2 rounded text-white bg-[#81A5C3] hover:bg-[#91B5D3]">회원가입</button>
	<a href="/auth/signin" class="text-gray-500 hover:text-sky-500 text-sm text-center"
		>이미 계정이 있으신가요? 로그인 하러가기</a
	>
</form>
