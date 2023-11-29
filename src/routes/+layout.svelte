<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { queryClientStore } from '$lib/stores/QueryClient';
	import { userStore } from '$lib/stores/User';
	import { acePrepUserStore } from '$lib/stores/AceprepUser';
	export let data: LayoutData;
	$: userStore.set(data.session?.user);
	acePrepUserStore.set(data.user);
	supabaseStore.set(data.supabase);
	data.supabase.auth.onAuthStateChange((event, session) => {
		// console.log('자 Persistent 세션은 어떻게 되나 보자고', event, session);
		if (event === 'INITIAL_SESSION' && session?.user) {
			data.supabase
				.from('User')
				.update({ last_sign_in_at: new Date() })
				.eq('id', session?.user?.id)
				.then((res) => {
					if (res.error) console.log('error', res.error);
					else console.log('Last Login Updated');
				});
		}
	});
	queryClientStore.set(data.queryClient);
	// Initialize Firebase
</script>

<svelte:head>
	<title>ACE PREP</title>
	<meta name="에이스 프렙" content="에이스프렙 SAT 모의고사" />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<main class="h-screen w-screen flex flex-col items-stretch">
		<slot />
		<SvelteToast />
	</main>
</QueryClientProvider>
