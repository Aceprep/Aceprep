<script lang="ts">
	import { page } from '$app/stores';
	import TestLayout from '$lib/components/test/TestLayout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Icon from '@iconify/svelte';
	import { useTestRecord } from '$lib/stores/TestRecord';
	import { dateTimeFormatter } from '$lib/DateTools';
	import { test } from '$lib/stores/AdminTest';

	// 이게 맞다! 비즈니스 로직 분리하자.s 너무 깔끔해!!

	const testRecord = useTestRecord();
	let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
</script>

{#if $testRecord === undefined}
	<!-- <p>Loading..</p> -->
{:else}
	<div class="flex gap-4">
		<div class=" inline-block">
			<h1 class=" font-semibold text-4xl">Score Details</h1>
			<h6>{$testRecord.Test.title}-{dateTimeFormatter.format(new Date($testRecord.created_at))}</h6>
		</div>
		<!-- <button
			class="rounded-full h-fit py-2 px-6 font-semibold bg-primary hover:bg-primary-focus text-white"
			>Review Test</button
		> -->
	</div>
	<div class="flex flex-col items-start gap-4">
		<h4 class=" font-semibold text-3xl">Questions Overview</h4>
		<div class="flex w-full bg-primary-back/50 py-6">
			<div class="flex-1 block text-center">
				<strong class="text-4xl font-semibold text-gray-600">{$testRecord.total_count}</strong>
				<p>Total Questions</p>
			</div>
			<div class="flex-1 block text-center border-x border-gray-700">
				<strong class="text-4xl font-semibold text-gray-600">{$testRecord.correct_count}</strong>
				<p>Correct Answers</p>
			</div>
			<div class="flex-1 block text-center">
				<strong class="text-4xl font-semibold text-gray-600"
					>{$testRecord.total_count - $testRecord.correct_count}</strong
				>
				<p>Incorrect Answers</p>
			</div>
		</div>
		<table class="w-full">
			<thead class=" bg-stone-700 text-white divide-x">
				<th>Question</th>
				<th>Section</th>
				<th>Correct Answer</th>
				<th>Your Answer</th>
				<!-- <th>Actions</th> -->
			</thead>
			<tbody>
				{#each $testRecord.Test.Question as question, index}
					<tr>
						<td>{index + 1}</td>
						<td>Reading and Writing</td>
						<td
							>{alphabets.at(
								question.Choice.find((choice) => choice.is_correct)?.choice_num ?? 0
							)}</td
						>
						<td>
							{#if $testRecord.student_answer.find((answer) => answer.question_id == question.id)?.choice_id === null}
								<p class=" text-red-700">
									{'Omitted'}
								</p>
							{:else if $testRecord.student_answer.find((answer) => answer.question_id == question.id)?.Choice.is_correct}
								<p class=" text-green-600">
									{alphabets.at(
										$testRecord.student_answer.find((answer) => answer.question_id == question.id)
											?.Choice.choice_num ?? 0
									)}
									{': Correct'}
								</p>
							{:else}
								<p class=" text-red-700">
									{alphabets.at(
										$testRecord.student_answer.find((answer) => answer.question_id == question.id)
											?.Choice.choice_num ?? 0
									)}{': Incorrect'}
								</p>
							{/if}
						</td>
						<!-- <td
							><button class=" rounded-full border border-gray-700 py-3 px-6 hover:bg-gray-100"
								>Review</button
							>
							</td
						> -->
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<!-- <p>
	{JSON.stringify($question)}
</p> -->
<!-- <p>{JSON.stringify($testRecord)}</p> -->

<style>
	th {
		@apply font-normal py-2;
	}
	td {
		@apply text-center py-4 border border-gray-300;
	}
</style>
