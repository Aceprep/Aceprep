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

	let currentPage = Number($page.url.searchParams.get('page') ?? 1);
	let limit = 10;
	let testsQuery = createQuery({
		queryKey: ['tests', currentPage],
		queryFn: async () =>
			await $supabaseStore!
				.from('Test')
				.select('*,Question(*), User(*)', { count: 'exact' })
				.range((currentPage - 1) * limit, currentPage * limit)
				.order('is_published', { ascending: false })
				.order('created_at', { ascending: false })
	});
	$: tests = $testsQuery.data?.data as (Tables<'Test'> & {
		User: Tables<'User'>;
		Question: Tables<'Question'>[];
	})[];

	let totalPage: number = 0;
	$: totalPage = Math.ceil($testsQuery.data?.count! / limit);
</script>

<button
	class="self-end bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded"
	on:click={async () => {
		let newTest = await $supabaseStore?.from('Test').insert({}).select().single();
		goto(`/admin/test/${newTest?.data.id}/0`);
	}}
>
	+ 테스트 생성
</button>

<!-- {JSON.stringify($testsQuery.data?.data)} -->
<Table headers={['생성일', '테스트명', '타입', '작성자', '문제수', '활성화', '삭제']}>
	{#if $testsQuery.isSuccess && tests !== undefined}
		{#each tests as test, index}
			<tr
				class="bg-white hover:bg-gray-50 cursor-pointer"
				on:click={() => goto('/admin/test/' + test.id + '/0')}
			>
				<td>
					{dateTimeFormatter.format(new Date(test.created_at))}
				</td>
				<td>
					{test.title}
				</td>
				<td>
					{test.is_practice ? 'Practice' : 'Test'}
				</td>
				<td> {test.User.name} </td>
				<td> {test.Question.length} </td>
				<td>
					<button
						class={`font-semibold ${test.is_published ? 'text-sky-500' : 'text-gray-500'}`}
						on:click={async (e) => {
							e.stopPropagation();
							const res = await $supabaseStore
								?.from('Test')
								.update({ is_published: !test.is_published })
								.match({ id: test.id });
							if (res?.error) alert(res.error.message);
							else {
								toast.push(`${test.is_published ? '비활성화' : '활성화'}되었습니다.`);
								$queryClientStore?.refetchQueries({ queryKey: ['tests', currentPage] });
							}
						}}
					>
						{#if test.is_published}
							활성화
						{:else}
							비활성화
						{/if}
					</button>
				</td>
				<td>
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
						class="px-2 py-1 text-gray-500 hover:text-red-500 rounded"
					>
						삭제</button
					>
				</td>
			</tr>
		{/each}
	{:else if $testsQuery.isError}
		<p>Error: {$testsQuery.data?.error}</p>
	{:else if $testsQuery.isLoading}
		<p>Loading..</p>
	{:else}
		<p>{JSON.stringify($testsQuery.data?.error)}</p>
	{/if}
</Table>
{#if totalPage > 0}
	<Pagination {totalPage} />
{/if}

<style>
	td {
		@apply text-center py-2;
	}
</style>
