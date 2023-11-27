<script lang="ts">
	import type { Tables } from '$lib/types/database.types';

	export let isChoiceEliminationOn: boolean = false;
	export let choices: Tables<'Choice'>[];
	export let eliminated: number[] = [];
	export let isEditing: boolean = false;
	export let selectedChoiceId: number | null = null;
	let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	let correctId: number = 0;
	$: choices = choices.map((choice) => {
		if (correctId === choice.id) {
			choice.is_correct = true;
			return choice;
		} else {
			choice.is_correct = false;
			return choice;
		}
	});
	$: eliminated = eliminated.filter((e) => e !== selectedChoiceId);
</script>

{#each choices as choice, index}
	<div class="flex">
		<div class="relative flex-1 px-2">
			<button
				class={' w-full flex items-center gap-3 border-[2px]  border-gray-600 rounded-lg p-2 ' +
					(selectedChoiceId === choice.id ? 'ring-[3px] ring-blue-500 ' : '') +
					(eliminated.includes(choice.id) ? 'opacity-50' : '')}
				on:click={() => (selectedChoiceId = choice.id)}
			>
				<div
					class="flex items-center justify-center rounded-full px-[0.4rem] border-[3px] border-gray-600"
				>
					<p class="font-bold">{alphabets[index]}</p>
				</div>
				{#if isEditing}
					<input type="text" bind:value={choice.choice} class="flex-1" />
					<label>
						정답
						<input type="radio" value={choice.id} bind:group={correctId} class="flex-1" />
					</label>
				{:else}
					<p>{choice.choice}</p>
				{/if}
			</button>

			{#if eliminated.includes(choice.id)}
				<div class=" absolute left-0 top-[1.3em] w-full">
					<div class="border-b-[3px] border-gray-900" />
				</div>
			{/if}
		</div>
		{#if isChoiceEliminationOn}
			<label class="w-[50px] ml-2 relative flex items-center justify-center cursor-pointer">
				<input type="checkbox" bind:group={eliminated} value={choice.id} />
				{#if eliminated.includes(choice.id)}
					<p class=" font-semibold underline">Undo</p>
				{:else}
					<div class=" rounded-full border px-[0.4rem] border-gray-900">
						<p>{alphabets[index]}</p>
					</div>
					<div class=" absolute left-0 top-[1.3em] w-full px-1">
						<div class="border-b-[3px] border-gray-900" />
					</div>
				{/if}
			</label>
		{/if}
	</div>
{/each}

<style>
	input {
		@apply border border-gray-500 px-2;
	}
	input[type='checkbox'] {
		display: none;
	}
</style>
