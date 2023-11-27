<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import Icon from '@iconify/svelte';
	import ChoiceItems from '../ChoiceItems.svelte';
	import type { Question } from '$lib/types/test';
	import { page } from '$app/stores';
	import ChoiceItemsEdit from '../ChoiceItemsEdit.svelte';
</script>

<div class="flex-1 flex flex-col gap-2">
	<div class="self-stretch flex bg-gray-100">
		<div class="flex items-center justify-center p-2 bg-gray-900">
			<p class=" text-white font-bold text-xl">{Number($page.params.questionNum) + 1}</p>
		</div>
		<button class=" flex items-center">
			<div class="w-[2rem] h-[2rem]">
				<Icon icon="material-symbols:bookmark-outline" class="w-full h-full " />
			</div>
			<p class="font-semibold">Mark for Review</p>
		</button>
		<div class="flex-1 flex justify-end p-2">
			<button
				class={'rounded  font-semibold  line-through text-sm px-1 border-2 border-black text-black'}
				>ABC</button
			>
		</div>
	</div>
	<slot name="choice_intro" />
	<slot name="choice" />
</div>
