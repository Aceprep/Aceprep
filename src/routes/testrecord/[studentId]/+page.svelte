<script lang="ts">
	import { page } from '$app/stores';
	import TestLayout from '$lib/components/test/TestLayout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Icon from '@iconify/svelte';
	import { useTestRecords } from '$lib/stores/TestRecord';
	import ScoreCard from './ScoreCard.svelte';
	import { dateTimeFormatter } from '$lib/DateTools';

	// 이게 맞다! 비즈니스 로직 분리하자.s 너무 깔끔해!!

	const testRecords = useTestRecords();
</script>

{#if $testRecords === undefined}
	<!-- <p>Loading..</p> -->
{:else}
	<h1 class=" font-semibold text-4xl">My SAT Practice Tests</h1>

	<div class="flex overflow-x-scroll w-full gap-8 pb-2">
		{#each $testRecords as TestRecord}
			<ScoreCard>
				<h6 slot="testTitle">{TestRecord.Test.title}</h6>
				<p slot="createdAt">
					{dateTimeFormatter.format(new Date(TestRecord.created_at))}
				</p>
				<p slot="readCorrectCount">
					{TestRecord.correct_count}
				</p>
				<p slot="readCorrectToTotal">
					{`${TestRecord.correct_count} to ${TestRecord.total_count}`}
				</p>
				<p slot="correctCount">
					{TestRecord.correct_count}
				</p>
				<p slot="correctToTotal">
					{`${TestRecord.correct_count} to ${TestRecord.total_count}`}
				</p>
				<a
					href={`/testrecord/detail/${TestRecord.id}`}
					class="rounded-full bg-primary hover:bg-primary-focus transition-colors duration-500 text-white w-full py-2 flex justify-center"
					slot="detailLink">Score Details</a
				>
			</ScoreCard>
		{/each}
	</div>
{/if}

<!-- <p>
	{JSON.stringify($question)}
</p> -->
<!-- <p>{JSON.stringify($testRecords)}</p> -->
