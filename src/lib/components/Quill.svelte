<script lang="ts">
	import { browser } from '$app/environment';
	import { supabaseStore } from '$lib/stores/ClientSupabase';
	import { onMount } from 'svelte';

	let editor: HTMLDivElement;
	export let content: string = '';
	export let placeholder: string = 'Write question here...';
	// Quill 초기화는 이렇.... 아니 그냥 페이징 쓰면 되는거 아닌가?
	$: {
		if (
			editor &&
			editor.querySelector('.ql-editor')?.innerHTML !== undefined &&
			editor.querySelector('.ql-editor')?.innerHTML !== content
		) {
			editor.querySelector('.ql-editor')!.innerHTML = content;
		}
	}
	export let toolbarOptions = {
		container: [
			[
				{ header: 1 },
				{ header: 2 },
				{ size: ['small', false, 'large', 'huge'] },
				'blockquote',
				// 'link',
				'image'
				// 'video'
			],
			['bold', 'italic', 'underline'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ align: [] }],
			['clean']
		]
		// handlers: {
		// 	image: function imageHandler(e: any) {
		// 		// 1. 이미지를 저장할 input type=file DOM을 만든다.
		// 		const input = document.createElement('input');
		// 		// 속성 써주기
		// 		input.setAttribute('type', 'file');
		// 		input.setAttribute('accept', 'image/*');
		// 		input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
		//         editor.getEd
		// 	}
		// }
	};

	onMount(async () => {
		const { default: Quill } = await import('quill');
		const { default: ImageUploader } = await import('quill-image-uploader' as any);
		Quill.register('modules/imageUploader', ImageUploader);

		let quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions,
				imageUploader: {
					upload: async (file: File) => {
						console.log('file', file);
						const { data, error } = await $supabaseStore!.storage
							.from('test_pictures')
							.upload(crypto.randomUUID(), file);
						if (error) {
							alert(error.message);
							throw error;
						}
						console.log('path', data.path);
						const {
							data: { publicUrl }
						} = await $supabaseStore?.storage.from('test_pictures').getPublicUrl(data.path)!;
						console.log('publicUrl', publicUrl);

						return publicUrl;
					}
				}
			},
			theme: 'snow',
			placeholder: placeholder
		});
		editor.querySelector('.ql-editor')!.innerHTML = content;
		quill.on('text-change', () => {
			console.log('editor', editor.querySelector('.ql-editor')!.innerHTML);
			content = editor.querySelector('.ql-editor')!.innerHTML;
			console.log('content', content);
		});
	});
</script>

<div class="flex flex-col h-full">
	<div bind:this={editor} />
</div>

<style>
	/* @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css'; */
	@import './quill.snow.css';
</style>
