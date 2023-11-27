<script lang="ts">
	import { page } from '$app/stores';
	import TestLayout from '$lib/components/test/TestLayout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Icon from '@iconify/svelte';
	import TestHeader from '$lib/components/test/TestHeader.svelte';
	import TestAnswer from '$lib/components/test/TestAnswer.svelte';
	import { goto } from '$app/navigation';
	import { useStudentTestSummary } from '$lib/stores/StudentTestSummary';
	import { supabaseStore } from '$lib/stores/ClientSupabase.js';
	import { onDestroy, onMount } from 'svelte';
	import { userStore } from '$lib/stores/User.js';
	import type { Tables } from '$lib/types/database.types.js';
	export let data;

	// 이게 맞다! 비즈니스 로직 분리하자. 너무 깔끔해!!
	const { test, error, student_answer_list, next, back } = useStudentTestSummary();

	let testTimeRecord: Tables<'test_time_record'>[];

	let remainingTime = 0;
	let totalSpentTime = 0;
	let thisTestStartTime: Date;
	$: if (remainingTime < 0) remainingTime = 0;
	let remainingHour: string;
	let remainingMinute: string;
	$: {
		remainingHour = String(Math.floor(remainingTime / 3600));
		remainingMinute = String(Math.floor((remainingTime / 60) % 60));

		if (remainingHour.length === 1) remainingHour = '0' + remainingHour;
		if (remainingMinute.length === 1) remainingMinute = '0' + remainingMinute;
	}
	$: {
		if (
			!(!$test || !testTimeRecord || !testTimeRecord.find((record) => record.ended_at === null))
		) {
			testTimeRecord.forEach((record) => (totalSpentTime += record.spent_time ?? 0));
			thisTestStartTime = new Date(
				testTimeRecord.find((record) => record.ended_at === null)!.created_at
			);
			let now = new Date();
			let thisTestTimeSpent = Math.floor((now - thisTestStartTime) / 1000);
			console.log('thisTestTimeSpent', thisTestTimeSpent);
			remainingTime = $test.test_time * 60 - totalSpentTime;
		}
	}
	let intervalId = setInterval(() => {
		let now = new Date();
		let thisTestTimeSpent = Math.floor((now - thisTestStartTime) / 1000);
		console.log('thisTestTimeSpent', thisTestTimeSpent);
		remainingTime = $test.test_time * 60 - totalSpentTime - thisTestTimeSpent;
		console.log('remainingTime', remainingTime);
	}, 1000);

	onDestroy(() => {
		clearInterval(intervalId);
	});
	onMount(() => {
		$supabaseStore!
			?.from('test_time_record')
			.select('*')
			.eq('test_record_id', $page.params.testRecordId)
			.eq('student_id', $userStore!.id)
			.then(async ({ data: testTimeData, error }) => {
				if (error) throw error;
				if (testTimeData.length === 0 || !testTimeData.find((record) => record.ended_at === null)) {
					console.log('새로운 테스트 시간 레코드 생성');
					await $supabaseStore
						?.from('test_time_record')
						.insert([{ test_record_id: $page.params.testRecordId, student_id: $userStore!.id }])
						.select('*')
						.then(({ data: testTimeData, error }) => {
							if (error) throw error;
							console.log('새로운 테스트 시간 사용 로그', testTimeData);
						});
					const { data, error } = await $supabaseStore!
						?.from('test_time_record')
						.select('*')
						.eq('test_record_id', $page.params.testRecordId)
						.eq('student_id', $userStore!.id);
					if (error) throw error;
					testTimeRecord = data;
					return;
				}
				console.log('기존 테스트 시간 사용 로그', testTimeData);
				testTimeRecord = testTimeData;
			});
	});

	async function saveAndExit() {
		// 여기에 테스트 시간 저장 코드 추가
		let thisTestTimeRecord = testTimeRecord!.find((record) => record.ended_at === null)!;
		let spent_time = Math.floor((new Date() - new Date(thisTestTimeRecord.created_at)) / 1000);
		console.log('spent_time', spent_time);

		await $supabaseStore!
			?.from('test_time_record')
			.update({ ended_at: new Date(), spent_time: spent_time })
			.eq('id', thisTestTimeRecord.id);
		goto(`/`);
	}

	let questionGridOpen = false;
</script>

{#if $test === undefined}
	<p>Loading..</p>
{:else if $error}
	<p>Error: {$error}</p>
{:else if $test !== undefined}
	<TestLayout>
		<TestHeader {saveAndExit}>
			<h2 class="text-xl font-semibold" slot="title">{$test.title}</h2>
			<p class="flex items-center text-xl" slot="timer">
				{remainingHour}:{remainingMinute}
			</p>
		</TestHeader>
		{#if $student_answer_list}
			<div class="w-full border-b-2 border-primary" />
			<div class="flex flex-col mt-8 gap-8 items-center h-[600px]">
				<h6 class=" text-3xl">Check Your Work</h6>
				<p>
					On test day, you won't be able to move on to the next module until time expires. <br />
					For these practice questions, you can click
					<strong class="font-bold">{` Next `}</strong>when you're ready to move on.
				</p>
				<div class="shadow flex flex-col p-4 gap-8">
					<div class=" flex justify-between gap-4 border-b border-gray-400 pb-4">
						<h6 class=" font-semibold text-xl">Section 1: Reading and Writing Questions</h6>
						<div class="flex items-center gap-2">
							<div class="flex items-center gap-2">
								<div class=" border border-gray-800 border-dashed w-5 h-5" />
								<p>Unanswered</p>
							</div>

							<div class="flex items-center gap-2">
								<Icon icon="mdi:bookmark" class="w-6 h-6 text-red-800" />
								<p>For Review</p>
							</div>
						</div>
					</div>
					<div>
						{#each $test.Question as question, i}
							<div class="relative inline-block m-4">
								{#if i === Number($page.params.questionNum)}
									<button
										class={'flex items-center justify-center w-[3rem] h-[3rem] border border-gray-800 bg-blue-800'}
										disabled
										>{Number(i) + 1}
									</button>{:else if $student_answer_list.find((answer) => answer.question_id === question.id && answer.choice_id !== null)}
									<button
										class={'relative flex items-center justify-center w-[3rem] h-[3rem] border border-gray-800 text-blue-800'}
										on:click={(e) => {
											e.stopPropagation();
											questionGridOpen = false;
											goto(`/student/test/${$test.id}/${$page.params.testRecordId}/${i}`);
										}}
										>{Number(i) + 1}
									</button>
								{:else}
									<button
										class={'relative flex items-center justify-center w-[3rem] h-[3rem] border border-gray-800 border-dashed text-blue-800'}
										on:click={(e) => {
											e.stopPropagation();
											questionGridOpen = false;
											goto(`/student/test/${$test.id}/${$page.params.testRecordId}/${i}`);
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
				</div>
			</div>

			<div class="w-full border-b-2 border-primary" />
			<div class="TestFooter flex p-8 justify-between">
				<h6 class="text-xl font-semibold w-[176.63px]">
					{data.user.name}
				</h6>
				<div class="flex gap-2">
					{#if $page.params.questionNum !== '0'}
						<button
							class="bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
							on:click={back}
						>
							Back
						</button>
					{/if}
					<button
						class="bg-blue-700 text-white font-semibold py-2 px-6 rounded-full"
						on:click={async () => {
							let thisTestTimeRecord = testTimeRecord.find((record) => record.ended_at === null);
							let spent_time = Math.floor(
								(new Date() - new Date(thisTestTimeRecord.created_at)) / 1000
							);
							console.log('spent_time', spent_time);

							await $supabaseStore
								?.from('test_time_record')
								.update({ ended_at: new Date(), spent_time: spent_time })
								.eq('id', thisTestTimeRecord.id);
							next();
						}}>Next</button
					>
				</div>
			</div>
		{/if}
	</TestLayout>
{/if}

<!-- <p>
	{JSON.stringify($question)}
</p> -->
<!-- <p>{JSON.stringify($student_answer_list)}</p> -->
