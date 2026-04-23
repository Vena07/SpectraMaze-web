<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { data } = $props();
</script>

<div class="app-layout">
	<Header user={data.user} />
	<main class="container">
		<slot />
	</main>
	<Footer />
</div>

<style>
	:global(body) { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; }
	:global(*) { box-sizing: border-box; }
	.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
	.container {
		flex: 1;
		width: 100%; max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;
	}
</style>