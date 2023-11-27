<script lang="ts">
	import logo from '$lib/images/logo_origin.jpeg';
</script>

<div
	class="rounded-lg overflow-hidden shadow-lg border border-gray-400/30 flex flex-col items-stretch gap-4"
>
	<img src={logo} alt="logo" class="w-full h-[10rem] mx-auto" />

	<slot />
</div>
