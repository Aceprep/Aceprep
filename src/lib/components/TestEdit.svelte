<script lang="ts">
	import Icon from '@iconify/svelte';
	import Quill from './Quill.svelte';
	import ChoiceItems from './ChoiceItems.svelte';
	import type { User } from '$lib/types/user';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { test } from '$lib/stores/AdminTest';
	import type { Question, TestType } from '$lib/types/test';
	import { toast } from '@zerodevx/svelte-toast';
	import TestLayout from './test/TestLayout.svelte';
	import TestHeader from './test/TestHeader.svelte';
	import TestAnswer from './test/TestAnswer.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let user: User;
	console.log($test);
	//* 좀 크게크게 역할을 나눠. 테스트, 퀘스쳔, 초이스 다 따로 역할 분배하라고.
	if ($test && $test.Question.length === 0) {
		test.createQuestion($test.id);
	}
	$: questionNumber = test.questionNumber;

	$: question = $test.Question.at($questionNumber) as Question;
	let isDirectionOpen = false;
	let questionGridOpen = false;
	async function save() {
		const { Question, ...newTest } = $test;
		const { Choice, ...newQuestion } = question;
		const res = await Promise.all([
			$supabaseStore!.from('Test').upsert(newTest),
			$supabaseStore!.from('Question').upsert(newQuestion),
			$supabaseStore!.from('Choice').upsert(Choice)
		]);
		console.log('res', res);
		if (res.find((r) => r.error)) alert('Error');
		else toast.push('Saved');
	}

	async function back() {
		$questionNumber -= 1;
	}

	async function next() {
		if ($test.Question[$questionNumber + 1] === undefined) {
			test.createQuestion($test.id);
			toast.push('New Question Created');
		}
		$questionNumber += 1;
	}
</script>

<!-- {JSON.stringify(choices)} -->
<TestLayout>
	<TestHeader>
		<h2 class="text-xl font-semibold" slot="title">{$test.title}</h2>
		<p class="flex items-center text-xl" slot="timer">
			{0}:{$test.test_time}
		</p>
	</TestHeader>
	{#if $question && $student_answer}
		<div class="w-full border-b-2 border-primary" />
		<div class="flex gap-2 h-[600px]">
			<div class="flex-1 h-full ql-editor">
				{@html $question?.paragraph ?? ''}
			</div>
			<div class=" self-stretch border-r-4 border-gray-300" />
			<TestAnswer question={$question} bind:student_answer={$student_answer} />
		</div>
		<div class="w-full border-b-2 border-primary" />
		<div class="TestFooter flex p-8 justify-between">
			<h6 class="text-xl font-semibold w-[176.63px]">
				{data.user.name}
			</h6>
			<button
				class="relative p-2 flex items-center rounded-lg bg-black text-white font-semibold"
				on:click={() => (questionGridOpen = !questionGridOpen)}
			>
				Questions {Number($page.params.questionNum) + 1} of {$test.Question.length}
				<Icon icon="mdi:chevron-left" rotate={1} class="w-[1.5rem] h-[1.5rem]" />
				{#if questionGridOpen}
					<button
						on:click={(e) => {
							e.stopPropagation();
						}}
						class="QuestionGrid absolute flex flex-col left-[50%] -top-0 -translate-x-[50%] -translate-y-[100%] gap-6 items-center p-4 rounded bg-white border cursor-default"
					>
						<h6 class="text-xl font-semibold text-gray-900">
							Section 1: Reading and Writing Questions
						</h6>
						<div
							class="border-y-2 border-gray-400 py-2 w-full flex justify-center gap-4 text-black font-normal"
						>
							<div class="flex items-center gap-2">
								<div class="w-[1.5rem] h-[1.5rem]">
									<Icon icon="pajamas:location" class="w-full h-full text-black" />
								</div>
								Current
							</div>
							<div class="flex items-center gap-2">
								<div class="w-[1.5rem] h-[1.5rem] border border-dashed border-gray-900" />
								Unanswered
							</div>
							<div class="flex items-center gap-2">
								<div class="w-[1.5rem] h-[1.5rem]">
									<Icon icon="material-symbols:bookmark" class="w-full h-full text-red-800 " />
								</div>
								For Review
							</div>
						</div>
						<div class="grid grid-cols-10 gap-[3rem]">
							{#each $test.Question as question, i}
								<div class="relative">
									{#if i === Number($page.params.questionNum)}
										<button
											class={'flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 bg-blue-800'}
											disabled
											>{Number(i) + 1}
										</button>{:else if $student_answer_list.find((answer) => answer.question_id === question.id && answer.choice_id !== null)}
										<button
											class={'relative flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 text-blue-800'}
											on:click={(e) => {
												e.stopPropagation();
												questionGridOpen = false;
												goto(`/student/test/${$test.id}/${i}`);
											}}
											>{Number(i) + 1}
										</button>
									{:else}
										<button
											class={'relative flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 border-dashed text-blue-800'}
											on:click={(e) => {
												e.stopPropagation();
												questionGridOpen = false;
												goto(`/student/test/${$test.id}/${i}`);
											}}
											>{Number(i) + 1}
										</button>
									{/if}

									{#if i === Number($page.params.questionNum)}
										<div
											class="absolute w-[1rem] h-[1rem] left-0 translate-x-[50%] top-0 -translate-y-[100%]"
										>
											<Icon icon="pajamas:location" class="w-full h-full text-black" />
										</div>
									{/if}
									{#if $student_answer_list.find((answer) => answer.question_id === question.id && answer.is_bookmarked)}
										<div
											class="absolute z-20 w-[1rem] h-[1rem] left-0 translate-x-[0%] top-0 -translate-y-[10%]"
										>
											<Icon icon="material-symbols:bookmark" class="w-full h-full text-red-800 " />
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</button>
				{/if}
			</button>
			<div class="flex gap-2">
				{#if $page.params.questionNum !== '0'}
					<button
						class="bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
						on:click={back}
					>
						Back
					</button>
				{/if}
				<button class="bg-blue-700 text-white font-semibold py-2 px-6 rounded-full" on:click={next}
					>Next</button
				>
			</div>
		</div>
	{/if}
</TestLayout>

<style>
	textarea {
		@apply border border-gray-500;
	}
</style>
