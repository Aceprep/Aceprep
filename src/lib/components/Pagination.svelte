<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	let BaseURL = $page.url.pathname;
	export let totalPage = 7; // 총 페이지 수를 설정합니다.

	let currentPage: number = 1;
	page.subscribe((newPage) => (currentPage = Number(newPage.url.searchParams.get('page') ?? '1')));
	const pageLimit = 5; // 한 번에 보여줄 페이지 버튼의 수를 설정합니다.
	function calculateStart() {
		let start = currentPage - Math.floor(pageLimit / 2);
		return start < 1 ? 1 : start + pageLimit - 1 > totalPage ? totalPage - pageLimit + 1 : start;
	}
</script>

<div class="self-center flex gap-2">
	<a
		href={`${BaseURL}?page=${currentPage - 1}`}
		class="flex items-center font-semibold hover:text-sky-500"
		class:disabled={currentPage - 1 < 1}><Icon icon="ion:chevron-up" rotate={3} />이전</a
	>
	{#each Array(pageLimit)
		.fill(1)
		.map((_, i) => calculateStart() + i) as pageNum (pageNum)}
		{#if pageNum <= totalPage}
			<a
				class="font-semibold hover:text-primary-focus p-2 rounded"
				class:current={pageNum === currentPage}
				href={`${BaseURL}?page=${pageNum}`}>{pageNum}</a
			>
		{/if}
	{/each}
	<a
		href={`${BaseURL}?page=${currentPage + 1}`}
		class="flex items-center font-semibold hover:text-primary-focus"
		class:disabled={currentPage + 1 > totalPage}
		>다음
		<Icon icon="ion:chevron-up" rotate={1} /></a
	>
</div>

<!-- <p>Current Page: {currentPage}</p> -->

<style>
	a.current {
		@apply bg-primary text-white;
	}
	a.disabled {
		pointer-events: none;
		color: #ccc;
	}
</style>
