<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { data, children } = $props();
</script>

<div class="space-background"></div>

<div class="app-layout">
	<Header user={data.user} />
	<main class="container">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	:global(body) { 
		margin: 0; 
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
		background-color: #020205; 
		color: #e2e8f0; 
		line-height: 1.6;
		overflow-x: hidden;
	}
	:global(*) { box-sizing: border-box; }

	/* Vesmírné pozadí s hvězdami */
	.space-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		background: #020205;
		background-image: 
			radial-gradient(1px 1px at 25px 5px, rgba(255,255,255,0.8), transparent),
			radial-gradient(1.5px 1.5px at 50px 25px, rgba(255,255,255,0.9), transparent),
			radial-gradient(1px 1px at 125px 20px, rgba(255, 255, 255, 0.6), transparent),
			radial-gradient(2px 2px at 50px 75px, rgba(255, 255, 255, 1), transparent),
			radial-gradient(1px 1px at 15px 125px, rgba(255,255,255,0.8), transparent),
			radial-gradient(1.5px 1.5px at 110px 80px, rgba(255, 255, 255, 0.5), transparent);
		background-size: 150px 150px;
		animation: drift 100s linear infinite;
	}

	@keyframes drift {
		0% { background-position: 0 0; }
		100% { background-position: -5000px 5000px; }
	}

	.app-layout { 
		display: flex; 
		flex-direction: column; 
		min-height: 100vh; 
		position: relative;
		z-index: 1;
	}
	.container {
		flex: 1;
		width: 100%; 
		max-width: 1200px; 
		margin: 2rem auto; 
		padding: 2rem;
		/* Glassmorphism efekt: poloprůhledné pozadí, které rozmaže hvězdy pod textem */
		background: rgba(15, 23, 42, 0.75);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(0, 255, 255, 0.15);
		box-shadow: 0 0 30px rgba(0, 255, 255, 0.05);
		border-radius: 12px;
	}

	/* Globální vylepšení pro SpectraMaze - lepší čitelnost a sci-fi nádech */
	:global(h1, h2, h3) {
		color: #ffffff;
		text-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
		letter-spacing: 1px;
	}
	
	:global(a) {
		color: #00ffff;
		text-decoration: none;
		transition: all 0.3s ease;
	}
	
	:global(a:hover) {
		text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
	}

	/* Globální tlačítka a formuláře ve sci-fi stylu napříč celým webem */
	:global(button), :global(input), :global(select), :global(textarea) {
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(0, 255, 255, 0.3);
		color: #00ffff;
		border-radius: 6px;
		font-family: inherit;
		transition: all 0.3s ease;
	}
	:global(button) {
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 1px;
		padding: 0.5rem 1rem;
	}
	:global(button:hover) {
		background: rgba(0, 255, 255, 0.15);
		box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
		text-shadow: 0 0 5px #00ffff;
	}

	/* Neonový posuvník (scrollbar) pro celý web */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}
	:global(::-webkit-scrollbar-track) {
		background: #020205;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: rgba(0, 255, 255, 0.3);
		border-radius: 4px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(0, 255, 255, 0.6);
	}
</style>