<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import Header from '$lib/components/Header.svelte';
	import Tabs from '../Tabs.svelte';
	import UserTable from '../user/UserTable.svelte';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { page } from '$app/stores';
	import Table from '$lib/components/Table.svelte';
	import { goto } from '$app/navigation';
	import { dateTimeFormatter } from '$lib/DateTools';
	import { toast } from '@zerodevx/svelte-toast';
	import { queryClientStore } from '$lib/stores/QueryClient';
	import type { Tables } from '$lib/types/database.types';
	export let data;

	let filter = {
		title: '',
		name: '',
		from: '',
		to: ''
	};

	let currentPage: number = 1;
	page.subscribe((newPage) => (currentPage = Number(newPage.url.searchParams.get('page') ?? '1')));

	$: testRecordsQuery = createQuery({
		queryKey: ['testRecords', currentPage],
		queryFn: async () => {
			let query = $supabaseStore!
				.from('test_record')
				.select('*, User!inner(name,id), Test!inner(title)', { count: 'exact' });

			if (filter.title) query = query.like('Test.title', `%${filter.title}%`);
			if (filter.name) query = query.eq('User.name', filter.name);
			if (filter.from) query = query.gte('created_at', filter.from);
			if (filter.to) query = query.lte('created_at', filter.to);
			query = query
				.range((currentPage - 1) * 10, currentPage * 10)
				.order('created_at', { ascending: false });
			return await query.then((res) => {
				console.log(res);
				return res;
			});
		}
	});
	$: testRecords = $testRecordsQuery.data?.data as (Tables<'test_record'> & {})[];

	let totalPage: number = 0;
	$: totalPage = Math.ceil($testRecordsQuery.data?.count! / 10);
</script>

<div class="flex gap-2 items-center justify-center">
	<label>
		테스트명
		<input bind:value={filter.title} />
	</label>
	<label>
		이름
		<input bind:value={filter.name} />
	</label>
	<label>
		from
		<input type="date" bind:value={filter.from} />
	</label>
	<label>
		to
		<input type="date" bind:value={filter.to} />
	</label>
	<button
		class="self-end bg-sky-400 hover:bg-sky-500 text-white font-bold py-1 px-2 rounded"
		on:click={() => {
			$queryClientStore?.invalidateQueries({ queryKey: ['testRecords', currentPage] });
		}}
	>
		검색
	</button>
</div>
<!-- {JSON.stringify($testRecordsQuery.data?.data)} -->
<Table headers={['시험응시일', '테스트명', '이름', '점수']}>
	{#if $testRecordsQuery.isSuccess && testRecords !== undefined}
		{#each testRecords as testRecord, index}
			<tr
				class="bg-white hover:bg-gray-50 cursor-pointer"
				on:click={() => goto('/testrecord/detail/' + testRecord.id)}
			>
				<td>
					{dateTimeFormatter.format(new Date(testRecord.created_at))}
				</td>
				<td>
					{testRecord.Test.title}
				</td>
				<td> {testRecord.User.name} </td>
				{#if testRecord.correct_count !== null}
					<td> {testRecord.correct_count}/{testRecord.total_count} </td>
				{:else}
					<td>In Progress</td>
				{/if}
				<!-- <td>
					<button
						on:click={async (e) => {
							e.stopPropagation();
							const result = confirm('정말로 삭제하시겠습니까?');
							if (!result) return;
							const res = await $supabaseStore?.from('Test').delete().match({ id: test.id });
							if (res?.error) alert(res.error.message);
							else {
								toast.push('삭제되었습니다.');
								$queryClientStore?.refetchQueries({ queryKey: ['tests', currentPage] });
							}
						}}
						class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
					>
						삭제</button
					>
				</td> -->
			</tr>
		{/each}
	{:else if $testRecordsQuery.isError}
		<p>Error: {$testRecordsQuery.data?.error}</p>
	{:else if $testRecordsQuery.isLoading}
		<p>Loading..</p>
	{:else}
		<p>{JSON.stringify($testRecordsQuery.data?.error)}</p>
	{/if}
</Table>
{#if totalPage > 0}
	<Pagination {totalPage} />
{/if}

<style>
	td {
		@apply text-center py-2;
	}
	input {
		@apply border border-gray-500 px-2 rounded;
	}
</style>
