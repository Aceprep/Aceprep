<script lang="ts">
	import { dateTimeFormatter } from '$lib/DateTools';
	import ClientButton from '$lib/components/ClientButton.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	export let headers: string[];
</script>

<table
	class="w-full text-xs sm:text-sm text-left text-gray-500 p-4 shadow border border-gray-500 rounded overflow-hidden"
>
	<thead class="text-sm text-white uppercase bg-primary">
		<tr>
			{#each headers as header}
				<th scope="col"> {header} </th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<slot />
	</tbody>
</table>

<style>
	td,
	th {
		@apply text-center py-4;
	}
</style>
