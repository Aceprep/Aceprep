<script lang="ts">
	import { page } from '$app/stores';
	import TestLayout from '$lib/components/test/TestLayout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Icon from '@iconify/svelte';
	import TestHeader from '$lib/components/test/TestHeader.svelte';
	import TestAnswer from '$lib/components/test/TestAnswer.svelte';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { supabaseStore } from '$lib/stores/ClientSupabase.js';
	import type { StudentTest } from '$lib/types/test.js';
	import type { PostgrestError } from '@supabase/supabase-js';
	import type { Tables } from '$lib/types/database.types.js';
	import { userStore } from '$lib/stores/User.js';
	export let data;
	$: console.log($page.params);
	let test: StudentTest;
	let error: PostgrestError | null = null;
	let student_answer: Tables<'student_answer'>;
	let student_answer_list: Tables<'student_answer'>[];
	let testTimeRecord: Tables<'test_time_record'>[];
	let remainingTime = 0;
	let totalSpentTime = 0;
	let thisTestStartTime = 0;
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
		if (!(!test || !testTimeRecord || !testTimeRecord.find((record) => record.ended_at === null))) {
			testTimeRecord.forEach((record) => (totalSpentTime += record.spent_time ?? 0));
			thisTestStartTime = new Date(
				testTimeRecord.find((record) => record.ended_at === null)!.created_at
			);
			let now = new Date();
			let thisTestTimeSpent = Math.floor((now - thisTestStartTime) / 1000);
			console.log('thisTestTimeSpent', thisTestTimeSpent);
			remainingTime = test.test_time * 60 - totalSpentTime;
		}
	}
	let intervalId = setInterval(() => {
		let now = new Date();
		let thisTestTimeSpent = Math.floor((now - thisTestStartTime) / 1000);
		console.log('thisTestTimeSpent', thisTestTimeSpent);
		remainingTime = test.test_time * 60 - totalSpentTime - thisTestTimeSpent;
		console.log('remainingTime', remainingTime);
	}, 1000);

	onDestroy(() => {
		clearInterval(intervalId);
	});
	console.log('refetch');

	$: $supabaseStore!
		.from('Test')
		.select('*,Question(*,Choice(question_id, id, choice))', {
			count: 'exact'
		})
		.eq('id', $page.params.testId)
		.order('created_at', { foreignTable: 'Question', ascending: true })
		.single()
		.then((res) => {
			test = res.data as StudentTest;
			error = res.error;
			if (res.error) console.log(res.error);
		});
	$: $supabaseStore!
		.from('student_answer')
		.select('*')
		.eq('test_record_id', $page.params.testRecordId)
		.eq('student_id', $userStore!.id)
		.then((res) => {
			student_answer_list = res.data as Tables<'student_answer'>[];
			if (res.error) console.log(res.error);
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

	$: question = test?.Question.at(Number($page.params.questionNum));
	$: if (question) getStudentAnswer();

	async function saveAndExit() {
		await saveAnswer();
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

	async function getStudentAnswer() {
		const res = await $supabaseStore!
			.from('student_answer')
			.select('*')
			.eq('question_id', question!.id)
			.eq('test_record_id', $page.params.testRecordId)
			.eq('student_id', $userStore!.id);
		if (res.data && res.data.length > 0) student_answer = res.data[0];
		else
			student_answer = {
				id: crypto.randomUUID(),
				student_id: $userStore!.id,
				test_record_id: $page.params.testRecordId,
				question_id: question!.id,
				choice_id: null,
				is_bookmarked: false
			};
	}

	async function saveAnswer() {
		await $supabaseStore!
			.from('student_answer')
			.upsert(student_answer!)
			.then((res) => {
				if (res.error) alert(res.error.message);
				else toast.push('Answer saved');
			});
	}

	function back() {
		saveAnswer().then(() => {
			goto(
				`/student/test/${$page.params.testId}/${$page.params.testRecordId}/${
					Number($page.params.questionNum) - 1
				}`
			);
		});
	}

	function next() {
		saveAnswer().then(() => {
			if (Number($page.params.questionNum) + 1 == test.Question.length)
				goto(`/student/test/${$page.params.testId}/${$page.params.testRecordId}/summary`);
			else
				goto(
					`/student/test/${$page.params.testId}/${$page.params.testRecordId}/${
						Number($page.params.questionNum) + 1
					}`
				);
		});
	}
	let questionGridOpen = false;
</script>

<!-- {JSON.stringify(remainingTime)} -->
{#if test === undefined}
	<p>Loading..</p>
{:else if $error}
	<p>Error: {$error}</p>
{:else if test !== undefined}
	<TestLayout>
		<TestHeader {saveAndExit} enableMore={true}>
			<h2 class="text-xl font-semibold" slot="title">{test.title}</h2>
			<p class="flex items-center text-xl" slot="timer">
				{remainingHour}:{remainingMinute}
			</p>
		</TestHeader>
		{#if question && student_answer}
			<div class="w-full border-b-2 border-primary" />
			<div class="flex gap-2 h-[700px]">
				<div class="flex-1 h-full ql-snow">
					<div class="ql-editor">
						{@html question?.paragraph ?? ''}
					</div>
				</div>
				<div class=" self-stretch border-r-4 border-gray-300" />
				<TestAnswer {question} bind:student_answer />
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
					Questions {Number($page.params.questionNum) + 1} of {test.Question.length}
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
								{#each test.Question as question, i}
									<div class="relative">
										{#if i === Number($page.params.questionNum)}
											<button
												class={'flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 bg-blue-800'}
												disabled
												>{Number(i) + 1}
											</button>
										{:else if student_answer_list.find((answer) => answer.question_id === question.id && answer.choice_id !== null)}
											<button
												class={'relative flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 text-blue-800'}
												on:click={(e) => {
													e.stopPropagation();
													questionGridOpen = false;
													saveAnswer().then(() => {
														goto(`/student/test/${test.id}/${$page.params.testRecordId}/${i}`);
													});
												}}
												>{Number(i) + 1}
											</button>
										{:else}
											<button
												class={'relative flex items-center justify-center w-[2rem] h-[2rem] border border-gray-800 border-dashed text-blue-800'}
												on:click={(e) => {
													e.stopPropagation();
													questionGridOpen = false;
													saveAnswer().then(() => {
														goto(`/student/test/${test.id}/${$page.params.testRecordId}/${i}`);
													});
												}}
												>{Number(i) + 1}
											</button>
										{/if}
										<!-- 현재 페이지 이면 지도마커 달아주기 -->
										{#if i === Number($page.params.questionNum)}
											<div
												class="absolute w-[1rem] h-[1rem] left-0 translate-x-[50%] top-0 -translate-y-[100%]"
											>
												<Icon icon="pajamas:location" class="w-full h-full text-black" />
											</div>
										{/if}

										{#if student_answer_list.find((answer) => answer.question_id === question.id && answer.is_bookmarked)}
											<div
												class="absolute z-20 w-[1rem] h-[1rem] left-0 translate-x-[0%] top-0 -translate-y-[10%]"
											>
												<Icon
													icon="material-symbols:bookmark"
													class="w-full h-full text-red-800 "
												/>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</button>
					{/if}
				</button>
				<div class="flex-1 flex gap-2 justify-end">
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
						on:click={next}>Next</button
					>
				</div>
			</div>
		{/if}
	</TestLayout>
{/if}
<!-- 
<p>
	{JSON.stringify(question)}
</p>
<p>{JSON.stringify(student_answer)}</p> -->
