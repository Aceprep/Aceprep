<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/logo_origin.jpeg';
	import type { User } from '$lib/types/user';
	import Icon from '@iconify/svelte';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { goto } from '$app/navigation';
	export let user: User;
	let isUserModalOpen = false;
</script>

<div class="flex justify-between items-end">
	<a href="/" class="w-[20rem] h-[118.59px]"
		><img src={logo} alt="Logo" class="w-[20rem] bg-transparent" /></a
	>
	<div class="flex items-center h-[48px]">
		{#if user.is_teacher}
			<a href="/admin" class="flex items-center rounded hover:bg-primary-back/50 p-2">
				<p class="font-semibold">관리자 페이지</p>
			</a>
		{/if}
		<div class=" relative z-10">
			<button
				on:click={() => (isUserModalOpen = true)}
				class="flex items-center rounded hover:bg-primary-back/50 p-2"
			>
				<p class="font-semibold">{user.name}</p>
				<div>
					<Icon icon="ei:user" class="w-[2rem] h-[2rem]" />
				</div>
			</button>

			{#if isUserModalOpen}
				<div class=" absolute bg-white top-[3rem] rounded border shadow flex flex-col">
					<button
						on:click={() => $supabaseStore?.auth.signOut().then(() => goto('/auth/signin'))}
						class=" z-10 p-2 hover:bg-primary-focus hover:text-white"
					>
						Sign out</button
					>
				</div>
				<button
					class="fixed w-screen h-screen left-0 top-0 cursor-default"
					on:click={() => (isUserModalOpen = false)}
				/>
			{/if}
		</div>
	</div>
</div>
