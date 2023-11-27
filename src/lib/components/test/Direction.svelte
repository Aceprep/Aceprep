<script lang="ts">
	import Icon from '@iconify/svelte';

	let isDirectionOpen = false;
</script>

<button
	class="relative text-gray-900 text-start flex items-center gap-1"
	on:click={() => (isDirectionOpen = !isDirectionOpen)}
>
	Directions
	<div class="w-[1.5rem] h-[1.5rem]">
		<Icon
			icon="mdi:chevron-down"
			class={'w-full h-full ' + (isDirectionOpen ? 'rotate-180' : '')}
		/>
	</div>
	{#if isDirectionOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="absolute z-10 top-[100%] mt-[1rem] left-0 p-8 flex flex-col bg-white shadow w-[900px] h-[500px] cursor-default"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<p>
				The questions in this section address a number of important reading and writing skills. Each
				question includes one or more passages, which may include a table or graph. Read each
				passage and question carefully, and then choose the best answer to the question based on the
				passage(s).
			</p>
			<p class="mt-2">
				All questions in this section are multiple-choice with four answer choice with four answer
				choices. Each question has a single best answer.
			</p>
			<button
				class="mt-auto justify-self-end self-end bg-yellow-300 rounded-full border border-gray-800 font-bold py-2 px-6 text-sm"
				on:click={(e) => {
					e.stopPropagation();
					isDirectionOpen = !isDirectionOpen;
				}}>Close</button
			>
		</div>
	{/if}
</button>
