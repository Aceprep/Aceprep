<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { PageData } from './$types';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { page } from '$app/stores';
	import { dateTimeFormatter } from '$lib/DateTools';
	import ClientButton from '$lib/components/ClientButton.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import type { Database, Tables } from '$lib/types/database.types';
	import Table from '$lib/components/Table.svelte';

	export let data: PageData;

	let currentPage: number = 1;
	page.subscribe((newPage) => (currentPage = Number(newPage.url.searchParams.get('page') ?? '1')));
	let totalPage: number = 0;
	let limit = 10;
	$: userQuery = createQuery({
		queryKey: ['users', currentPage],
		queryFn: async () =>
			await $supabaseStore!
				.from('User')
				.select('*', { count: 'exact' })
				.order('created_at', { ascending: false })
				.range((currentPage - 1) * limit, currentPage * limit - 1)
	});
	let users: Tables<'User'>[] = [];
	$: users = $userQuery.data?.data as Tables<'User'>[];

	$: totalPage = Math.ceil($userQuery.data?.count! / limit);
</script>

{#if $userQuery.isLoading}
	<div>Loading..</div>
{:else}
	<Table
		headers={[
			'가입일',
			'마지막 로그인',
			'유형',
			'이름',
			'전화번호',
			'이메일',
			'가입승인',
			' 회원삭제'
		]}
	>
		{#each users as user, index}
			<tr class="bg-white hover:bg-gray-50">
				<td>
					{dateTimeFormatter.format(new Date(user.created_at))}
				</td>
				<td>
					{dateTimeFormatter.format(new Date(user.last_sign_in_at))}
				</td>
				<td>
					{user.is_teacher ? '선생님' : '학생'}
				</td>
				<td> {user.name} </td>
				<td> {user.phone} </td>
				<td> {user.email} </td>
				<td>
					{#if !user.is_confirmed}
						<div class=" flex gap-1 justify-center">
							<ClientButton
								text="승인"
								className="!bg-sky-500 hover:!bg-sky-600"
								on:click={async () => {
									const resp = await $supabaseStore
										?.from('User')
										.update({ is_confirmed: true })
										.eq('id', user.id);
									console.log(resp);
									if (resp?.error) toast.push('승인 실패하였습니다.');
									else toast.push('승인되었습니다.');
									data.queryClient.invalidateQueries({ queryKey: ['users', currentPage] });
								}}
							/>
						</div>
					{:else}
						승인됨
					{/if}
				</td>
				<td>
					<ClientButton
						text="삭제"
						className="!bg-transparent !text-gray-500  hover:!text-red-500 transition-colors"
						on:click={async () => {
							const resp = await fetch(`/admin/user`, {
								method: 'DELETE',
								body: JSON.stringify({ userId: user.id })
							}).then((res) => res.json());
							console.log(resp);
							if (resp.data) toast.push('삭제 실패하였습니다.');
							else toast.push('삭제되었습니다.');
							data.queryClient.invalidateQueries({ queryKey: ['users', currentPage] });
						}}
					/>
				</td>
			</tr>
		{/each}
	</Table>
{/if}

{#if totalPage > 0}
	<Pagination {totalPage} />
{/if}

<style>
	td {
		@apply text-center py-4;
	}
</style>
