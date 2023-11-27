<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Tabs from '../admin/Tabs.svelte';
	export let data;
</script>

<section class="LogoWithWelcome h-full my-8">
	<div class="h-full flex flex-col gap-8 max-w-5xl mx-auto">
		<Header user={data.user} />
		<slot />
	</div>
</section>
