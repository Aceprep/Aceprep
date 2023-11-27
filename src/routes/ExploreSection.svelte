<script lang="ts">
	import Quill from '$lib/components/Quill.svelte';
	import { acePrepUserStore } from '$lib/stores/AceprepUser';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import Icon from '@iconify/svelte';
	import '$lib/components/quill.snow.css';
	let isEditing: boolean = false;
	let content = '';
	let files: FileList;

	let {
		data: { publicUrl }
	} = $supabaseStore?.storage.from('test').getPublicUrl('Event.jpg')!;
	fetchExplore();
	function fetchExplore() {
		$supabaseStore
			?.from('notice')
			.select('*')
			.eq('id', 'explore')
			.single()
			.then(({ data, error }) => {
				if (error) {
					console.log(error);
				} else {
					console.log(data);
					content = data?.content;
				}
			});
	}

	function saveExplore() {
		$supabaseStore
			?.from('notice')
			.upsert({ content: content, id: 'explore' })
			.then(({ data, error }) => {
				if (error) console.log(error);
			});
		$supabaseStore?.auth.getUser().then((res) => console.log(res));
		if (files && files.length === 1)
			$supabaseStore?.storage
				.from('test')
				.upload('Event.jpg', files[0], { upsert: true })
				.then((res) => console.log(res));
	}
</script>

<section
	class="ExploreAceprep
 flex flex-col gap-5 max-w-5xl w-full mx-auto py-8 items-stretch"
>
	<div class="flex justify-between">
		<h6 class="text-4xl font-semibold">Explore Aceprep</h6>
		{#if $acePrepUserStore?.is_admin}
			{#if !isEditing}
				<button on:click={() => (isEditing = !isEditing)} class="flex items-center">
					<Icon icon="ri:edit-fill" class="w-6 h-6 text-gray-600" />
					Edit
				</button>
			{:else}
				<button
					on:click={() => {
						console.log(files);
						console.log(content);
						saveExplore();
						isEditing = !isEditing;
					}}
					class="flex items-center"
				>
					<Icon icon="material-symbols:check" class="w-6 h-6 text-gray-600" />
					Save
				</button>
			{/if}
		{/if}
	</div>
	<div class="rounded-xl shadow-lg border flex items-stretch overflow-hidden">
		{#if !isEditing}
			{#if publicUrl}
				<img src={publicUrl} class="w-[20rem] h-[15rem] object-cover" alt="" />
			{:else}
				<img
					src="https://images.unsplash.com/photo-1621574539435-4b7b7b0b9b0a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZWVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
					class="w-[20rem] h-[15rem] object-cover"
					alt=""
				/>
			{/if}
			<div class="ql-snow">
				<div class="ql-editor">
					{@html content}
				</div>
			</div>
		{:else}
			<label class="p-2">
				Image upload
				<input type="file" bind:files />
			</label>
			<div class="h-[200px] w-full">
				<Quill placeholder="Write " bind:content />
			</div>
		{/if}
	</div>
</section>
