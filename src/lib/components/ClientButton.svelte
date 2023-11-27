<script lang="ts">
	export let text: string;
	export let className: string = '';
</script>

<button
	class={'text-xs sm:text-sm p-2 rounded bg-slate-900 text-white font-semibold ' + className}
	on:click
>
	{text}
</button>
