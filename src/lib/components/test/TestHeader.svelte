<script>
	import Icon from '@iconify/svelte';

	import Direction from './Direction.svelte';
	export let saveAndExit;
	export let enableMore = true;
	let isTimerHidden = false;
	let isMoreOpen = false;
</script>

<div class="text-xl font-semibold flex flex-col gap-1">
	<slot name="title" />
	<slot name="type" />
	<!-- {$studentTest.title} -->
</div>
<div class="flex">
	<div class="flex-1 flex flex-col">
		<h1 class="text-xl">Section 1: Reading and Writing</h1>
		<Direction />
	</div>
	<div class="flex flex-col items-center gap-1 justify-between">
		<!-- {0}:{$studentTest.test_time} -->
		{#if isTimerHidden}
			<div />
		{:else}
			<slot name="timer" />
		{/if}
		<button
			on:click={() => (isTimerHidden = !isTimerHidden)}
			class="w-[70px] rounded-full border border-gray-800 px-3 text-sm"
			>{isTimerHidden ? 'Show' : 'Hide'}</button
		>
	</div>
	<div class="flex-1 flex justify-end gap-2 w-[283px]">
		<button
			on:click={enableMore
				? () => {
						isMoreOpen = !isMoreOpen;
				  }
				: () => {}}
			class="relative flex flex-col justify-center items-center"
		>
			<Icon icon="mingcute:more-2-fill" class="h-[2rem] w-[1rem]" />
			<p class=" rounded-full px-3 text-sm font-semibold">More</p>
			{#if isMoreOpen}
				<button
					class="absolute bg-white border border-gray-500 rounded shadow flex flex-col top-[100%] mt-[1rem] right-0 cursor-default"
					on:click|stopPropagation
				>
					<button on:click={() => saveAndExit()} class="p-2 hover:bg-primary-back/50 w-[150px]"
						>Save And Exit</button
					>
				</button>
			{/if}
		</button>
	</div>
</div>
