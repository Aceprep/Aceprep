<script lang="ts">
	import { page } from '$app/stores';
	$: activePath = $page.url.pathname;
	const activeClass = 'inline-block p-4 border-b-2 text-primary-text font-bold border-primary-text';
	const tabs = [
		{
			name: '회원관리',
			path: '/admin/user'
		},
		{
			name: '시험관리',
			path: '/admin/test'
		},
		{
			name: '성적관리',
			path: '/admin/score'
		}
	];
</script>

<div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
	<ul class="flex flex-wrap -mb-px">
		{#each tabs as tab}
			<li class="mr-2">
				<a href={tab.path} class={activePath === tab.path ? activeClass : ''}>{tab.name}</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	a {
		@apply inline-block p-4 border-b-2;
	}
	a:hover {
		@apply text-gray-600 border-gray-300;
	}
</style>
