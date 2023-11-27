<script>
	import eventImg from '$lib/images/Event.jpg';
	import Icon from '@iconify/svelte';
	import Header from '$lib/components/Header.svelte';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { goto } from '$app/navigation';
	import { useStudentTestList } from '$lib/stores/StudentTestList';
	import ExploreSection from './ExploreSection.svelte';
	import { dateFormatter, dateTimeFormatter } from '$lib/DateTools';
	export let data;
	let testActive = true;
	let practiceAndPrepareActive = true;
	// console.log($supabaseStore);
	const { activeTest, testRecord, activePractice, practiceRecord, createTestRecord } =
		useStudentTestList();
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="LogoWithWelcome py-8">
	<div class="flex flex-col gap-8 max-w-5xl mx-auto">
		<Header user={data.user} />
		<h6 class=" text-2xl text-primary">
			Welcome {data.user.name}! Take a practice test and get ready for test day
		</h6>
	</div>
</section>

<section
	class="YourTestsSection
 flex flex-col max-w-5xl w-full mx-auto py-8 items-stretch"
>
	<div class="flex items-center gap-5">
		<h6 class="text-4xl font-semibold">Your Tests</h6>
		<div class="flex mr-auto border rounded overflow-hidden">
			<label
				class={' flex items-center py-1 pl-3 pr-5 cursor-pointer ' +
					(testActive ? 'text-white bg-gray-500' : '')}
			>
				<input
					type="radio"
					name="testActive"
					value={true}
					bind:group={testActive}
					class="opacity-0 w-0"
				/>
				<Icon icon="mdi:check" class={'w-4 h-4 ' + (!testActive && 'text-transparent')} />
				Active
			</label>
			<label
				class={' flex items-center py-1 pl-3 pr-5 cursor-pointer ' +
					(!testActive ? 'text-white bg-gray-500' : '')}
			>
				<input
					type="radio"
					name="testActive"
					value={false}
					bind:group={testActive}
					class="opacity-0 w-0"
				/>
				<Icon icon="mdi:check" class={'w-4 h-4 ' + (testActive && 'text-transparent')} />
				Past
			</label>
		</div>
		<a href="/" class="text-blue-800 font-semibold underline">Don't see your test here?</a>
	</div>
	<div class="flex gap-3 p-4 overflow-x-auto">
		{#if testActive}
			{#if $activeTest.length !== 0}
				{#each $activeTest as test}
					<button
						on:click={async () => {
							if (!test.test_record.find((record) => record.correct_count === null)) {
								const testRecordId = await createTestRecord(test.id);
								console.log('new TestRecordId', testRecordId);
								goto(`/student/test/${test.id}/${testRecordId}/0`);
							} else {
								const testRecordId = test.test_record.find(
									(record) => record.correct_count === null
								)?.id;
								goto(`/student/test/${test.id}/${testRecordId}/0`);
							}
						}}
						class="mt-4 rounded-xl w-[256px] shadow-lg border flex flex-col gap-3 items-stretch self-start overflow-hidden"
					>
						<h6
							class=" p-4 text-start h-[84px] line-clamp-2 overflow-hidden font-semibold text-xl bg-primary-back/20"
						>
							{test.title}
						</h6>
						{#if !test.test_record.find((record) => record.correct_count === null)}
							<div class="self-end pr-4 pt-[4rem] pb-[1.5rem]">
								<button
									class="rounded-full ring-1 hover:ring-2 hover:bg-gray-100 transition-all duration-200 ring-black py-2 px-4"
									>Start</button
								>
							</div>
						{:else}
							<div class=" flex items-center pl-2 gap-1">
								<Icon icon="ph:clock-bold" /> In Progress
							</div>
							<div class="self-end pr-4 pt-[28px] pb-[1.5rem]">
								<button
									class="rounded-full ring-1 hover:ring-2 hover:bg-gray-100 transition-all duration-200 ring-black py-2 px-4"
									>Resume</button
								>
							</div>
						{/if}
					</button>
				{/each}
			{:else}
				<div
					class="mt-4 p-4 rounded-xl shadow-lg border flex flex-col gap-3 items-center self-start"
				>
					<h6 class=" font-semibold text-xl">No Test Remaining</h6>
					<p class="max-w-md text-center">you've completed all the tests available to you.</p>
				</div>
			{/if}
		{:else if $testRecord.length !== 0}
			{#each $testRecord as record}
				<div
					class="mt-4 rounded-xl min-w-[16rem] shadow-lg border flex flex-col gap-3 items-stretch self-start overflow-hidden"
				>
					<h6
						class=" p-4 text-start pb-10 h-[84px] overflow-hidden font-semibold text-xl bg-primary-back/20"
					>
						{record.Test.title}
					</h6>
					<div class="flex items-center gap-2 px-2">
						<Icon icon="material-symbols:check" />Completed
					</div>
					<p class="ml-[2rem]">
						{dateTimeFormatter.format(new Date(record.created_at))}
					</p>
					<div class="self-end pr-4 pt-[4rem] pb-[1.5rem]">
						<a
							class=" underline hover:no-underline py-2 px-4 text-sm"
							href={`/testrecord/detail/${record.id}`}>View My Responses</a
						>
					</div>
				</div>
			{/each}
		{:else}
			<div class="mt-4 p-4 rounded-xl shadow-lg border flex flex-col gap-3 items-center self-start">
				<h6 class=" font-semibold text-xl">You Haven't Taken Any Digital Tests Yet</h6>
				<p class="max-w-md text-center">
					Once you take any exam in the future, you'll see it listed here.
				</p>
			</div>
		{/if}
	</div>
</section>

<section
	class="PractiveAndPrepareSection
 flex flex-col max-w-5xl w-full mx-auto py-8 items-stretch"
>
	<div class="flex items-center gap-5">
		<h6 class="text-4xl font-semibold">Practice and Prepare</h6>
		<div class="flex mr-auto border rounded overflow-hidden">
			<label
				class={' flex items-center py-1 pl-3 pr-5 cursor-pointer ' +
					(practiceAndPrepareActive ? 'text-white bg-gray-500' : '')}
			>
				<input
					type="radio"
					name="practiceAndPrepareActive "
					value={true}
					bind:group={practiceAndPrepareActive}
					class="opacity-0 w-0"
				/>
				<Icon
					icon="mdi:check"
					class={'w-4 h-4 ' + (!practiceAndPrepareActive && 'text-transparent')}
				/>
				Active
			</label>
			<label
				class={' flex items-center py-1 pl-3 pr-5 cursor-pointer ' +
					(!practiceAndPrepareActive ? 'text-white bg-gray-500' : '')}
			>
				<input
					type="radio"
					name="practiceAndPrepareActive "
					value={false}
					bind:group={practiceAndPrepareActive}
					class="opacity-0 w-0"
				/>
				<Icon
					icon="mdi:check"
					class={'w-4 h-4 ' + (practiceAndPrepareActive && 'text-transparent')}
				/>
				Past
			</label>
		</div>
		<a href="/" class="text-blue-800 font-semibold underline">Learn more about Aceprep practice</a>
	</div>
	<div class="flex gap-3 p-4 overflow-x-auto">
		{#if practiceAndPrepareActive}
			{#if $activePractice.length !== 0}
				{#each $activePractice as test}
					<button
						on:click={async () => {
							if (!test.test_record.find((record) => record.correct_count === null)) {
								const testRecordId = await createTestRecord(test.id);
								console.log('new TestRecordId', testRecordId);
								goto(`/student/test/${test.id}/${testRecordId}/0`);
							} else {
								goto(`/student/test/${test.id}/${test.test_record[0].id}/0`);
							}
						}}
						class="mt-4 rounded-xl min-w-[256px] shadow-lg border flex flex-col gap-3 items-stretch self-start overflow-hidden"
					>
						<h6
							class=" p-4 text-start h-[84px] line-clamp-2 overflow-hidden font-semibold text-xl bg-primary-back/20"
						>
							{test.title}
						</h6>
						{#if !test.test_record.find((record) => record.correct_count === null)}
							<div class="self-end pr-4 pt-[4rem] pb-[1.5rem]">
								<button
									class="rounded-full ring-1 hover:ring-2 hover:bg-gray-100 transition-all duration-200 ring-black py-2 px-4"
									>Start</button
								>
							</div>
						{:else}
							<div class=" flex items-center pl-2 gap-1">
								<Icon icon="ph:clock-bold" /> In Progress
							</div>
							<div class="self-end pr-4 pt-[28px] pb-[1.5rem]">
								<button
									class="rounded-full ring-1 hover:ring-2 hover:bg-gray-100 transition-all duration-200 ring-black py-2 px-4"
									>Resume</button
								>
							</div>
						{/if}
					</button>
				{/each}
			{:else}
				<div
					class="mt-4 p-4 rounded-xl shadow-lg border flex flex-col gap-3 items-center self-start"
				>
					<h6 class=" font-semibold text-xl">No Test Remaining</h6>
					<p class="max-w-md text-center">you've completed all the tests available to you.</p>
				</div>
			{/if}
		{:else if $practiceRecord.length !== 0}
			{#each $practiceRecord as record}
				<div
					class="mt-4 rounded-xl min-w-[16rem] shadow-lg border flex flex-col gap-3 items-stretch self-start overflow-hidden"
				>
					<h6
						class=" p-4 text-start pb-10 h-[84px] overflow-hidden font-semibold text-xl bg-primary-back/20"
					>
						{record.Test.title}
					</h6>
					<div class="flex items-center gap-2 px-2">
						<Icon icon="material-symbols:check" />Completed
					</div>
					<p class="ml-[2rem]">
						{dateTimeFormatter.format(new Date(record.created_at))}
					</p>
					<div class="self-end pr-4 pt-[4rem] pb-[1.5rem]">
						<a
							class=" underline hover:no-underline py-2 px-4 text-sm"
							href={`/testrecord/detail/${record.id}`}>View My Responses</a
						>
					</div>
				</div>
			{/each}
		{:else}
			<div class="mt-4 p-4 rounded-xl shadow-lg border flex flex-col gap-3 items-center self-start">
				<h6 class=" font-semibold text-xl">You Haven't Taken Any Digital Tests Yet</h6>
				<p class="max-w-md text-center">
					Once you take any exam in the future, you'll see it listed here.
				</p>
			</div>
		{/if}
	</div>
</section>
<!-- {JSON.stringify($activeTest)} -->

<ExploreSection />
