<script lang="ts">
	import { page } from '$app/stores';
	import TestLayout from '$lib/components/test/TestLayout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Icon from '@iconify/svelte';
	import TestHeader from '$lib/components/test/TestHeader.svelte';
	import { useTestEdit } from '$lib/stores/TestEdit';
	import { goto } from '$app/navigation';
	import TestEditAnswer from '$lib/components/test/TestEditAnswer.svelte';
	import Quill from '$lib/components/Quill.svelte';
	import { onDestroy } from 'svelte';
	export let data;
	$: console.log($page.params);

	// 이게 맞다! 비즈니스 로직 분리하자. 너무 깔끔해!!
	const { test, error, question, next, back, deleteQuestion, done } = useTestEdit(
		$page.params.testId
	);
	let questionGridOpen = false;
	let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	let correctId: string = '';

	$: console.log(correctId);
	$: console.log($question);
	const questionUnsubscribe = question.subscribe((q) => {
		if (!q) return;
		if (q) {
			q.Choice.forEach((choice) => {
				console.log('choice', choice);

				if (choice.is_correct) {
					console.log('correctId', choice.id);
					correctId = choice.id;
				}
			});
		}
	});
	onDestroy(() => questionUnsubscribe());
	$: if ($question && correctId !== '') {
		console.log('A');
		$question.Choice = $question.Choice.map((choice) => {
			if (correctId === choice.id) {
				choice.is_correct = true;
				return choice;
			} else {
				choice.is_correct = false;
				return choice;
			}
		});
	}
</script>

<!-- {JSON.stringify($question)} -->
{#if $test === undefined}
	<p>Loading..</p>
{:else if $error}
	<p>Error: {$error}</p>
{:else if $test !== undefined}
	<TestLayout>
		<TestHeader enableMore={false}>
			<label slot="title">
				Title:
				<input bind:value={$test.title} class="rounded text-xl font-semibold" />
			</label>
			<label slot="type">
				Type:
				<select
					bind:value={$test.is_practice}
					class="rounded text-xl font-semibold text-center border border-gray-400"
				>
					<option value={false}>Test</option>
					<option value={true}>Practice</option>
				</select>
			</label>
			<label slot="timer">
				Time Limit:
				<input
					type="number"
					bind:value={$test.test_time}
					class=" rounded text-lg w-[70px] font-semibold"
				/>
				minutes
			</label>
		</TestHeader>
		{#if $question}
			<div class="w-full border-b-2 border-primary" />
			<div class="flex gap-2 h-[600px]">
				<div class="flex-1 h-full">
					<Quill bind:content={$question.paragraph} />
				</div>
				<div class=" self-stretch border-r-4 border-gray-300" />
				<TestEditAnswer>
					<textarea
						slot="choice_intro"
						bind:value={$question.choice_intro}
						class="w-full h-auto p-4"
					/>
					<div class="ChoiceGroup flex flex-col gap-2" slot="choice">
						{#each $question.Choice as choice, index}
							<div class="flex">
								<div class="relative flex-1 px-2">
									<div
										class={' w-full flex items-center gap-3 border-[2px]  border-gray-600 rounded-lg p-2 '}
									>
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
					</div>
				</TestEditAnswer>
			</div>
			<div class="w-full border-b-2 border-primary" />
			<div class="TestFooter flex p-8 justify-between">
				<h6 class="flex-1 text-xl font-semibold w-[176.63px]">
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
											</button>
										{:else}
											<button
												class={'relative flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 border-dashed text-blue-800'}
												on:click={(e) => {
													e.stopPropagation();
													questionGridOpen = false;
													goto(`/admin/test/${$test.id}/${i}`);
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
									</div>
								{/each}
							</div>
						</button>
					{/if}
				</button>
				<div class="flex-1 flex gap-1 justify-end text-sm">
					{#if $page.params.questionNum !== '0'}
						<button
							class="bg-blue-700 text-white font-semibold py-1 px-4 rounded-full"
							on:click={back}
						>
							Back
						</button>
					{/if}
					<button
						class="bg-gray-700 text-white font-semibold py-1 px-4 rounded-full"
						on:click={deleteQuestion}>Delete</button
					>
					<button
						class="bg-blue-700 text-white font-semibold py-1 px-4 rounded-full"
						on:click={next}>Next</button
					>
					<button
						class="bg-blue-700 text-white font-semibold py-1 px-4 rounded-full"
						on:click={done}
					>
						Done
					</button>
				</div>
			</div>
		{/if}
	</TestLayout>
{/if}

<!-- 
<p>
	{JSON.stringify($question)}
</p> -->

<style>
	input {
		@apply border border-gray-500 px-2;
	}
	input[type='checkbox'] {
		display: none;
	}
</style>
