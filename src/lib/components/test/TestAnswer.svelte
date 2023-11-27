<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import Icon from '@iconify/svelte';
	import ChoiceItems from '../ChoiceItems.svelte';
	import type { Question } from '$lib/types/test';
	import { page } from '$app/stores';
	export let student_answer: Tables<'student_answer'>;
	export let question: Question;
	console.log(student_answer);
	console.log(question);

	let isChoiceEliminationOn: boolean = false;
</script>

<div class="flex-1 flex flex-col gap-2">
	<div class="self-stretch flex bg-gray-100">
		<div class="flex items-center justify-center p-2 bg-gray-900">
			<p class=" text-white font-bold text-xl">{Number($page.params.questionNum) + 1}</p>
		</div>
		<button
			class=" flex items-center"
			on:click={() => (student_answer.is_bookmarked = !student_answer.is_bookmarked)}
		>
			<div class="w-[2rem] h-[2rem]">
				{#if student_answer.is_bookmarked}
					<Icon icon="material-symbols:bookmark" class="w-full h-full text-red-800 " />
				{:else}
					<Icon icon="material-symbols:bookmark-outline" class="w-full h-full " />
				{/if}
			</div>
			<p class="font-semibold">Mark for Review</p>
		</button>
		<div class="flex-1 flex justify-end p-2">
			<button
				on:click={() => (isChoiceEliminationOn = !isChoiceEliminationOn)}
				class={'rounded  font-semibold  line-through text-sm px-1 border-2 border-black ' +
					(isChoiceEliminationOn ? 'bg-blue-700 text-white ' : 'text-black')}>ABC</button
			>
		</div>
	</div>
	<p class="w-full h-auto p-4">{question.choice_intro}</p>
	<div class="ChoiceGroup flex flex-col gap-2">
		<ChoiceItems
			bind:choices={question.Choice}
			bind:selectedChoiceId={student_answer.choice_id}
			{isChoiceEliminationOn}
			isEditing={false}
		/>
	</div>
</div>
