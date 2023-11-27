<script lang="ts">
	import type { Tables } from '$lib/types/database.types';

	export let choices: Tables<'Choice'>[];
	let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	let correctId: string = '';
	$: choices = choices.map((choice) => {
		if (correctId === choice.id) {
			choice.is_correct = true;
			return choice;
		} else {
			choice.is_correct = false;
			return choice;
		}
	});
</script>

{#each choices as choice, index}
	<div class="flex">
		<div class="relative flex-1 px-2">
			<div class={' w-full flex items-center gap-3 border-[2px]  border-gray-600 rounded-lg p-2 '}>
				<div
					class="flex items-center justify-center rounded-full px-[0.4rem] border-[3px] border-gray-600"
				>
					<p class="font-bold">{alphabets[index]}</p>
				</div>
				<input type="text" bind:value={choice.choice} class="flex-1" />
				<label>
					정답
					<input type="radio" value={choice.id} bind:group={correctId} class="flex-1" />
				</label>
			</div>
		</div>
	</div>
{/each}
