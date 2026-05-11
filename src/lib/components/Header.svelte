<script>
	import { Gamepad2, LogIn, UserPlus, Settings, LayoutDashboard, LogOut, Map } from 'lucide-svelte';
	let { user } = $props();
</script>

<header>
	<div class="container">
		<a href="/" class="logo">
			<img src="/logo.png" alt="SpectraMaze Logo" class="header-logo" />
		</a>

		<nav>
			<a href="/maps"><Map size={18} /> Mapy</a>
			{#if user}
				<a href="/dashboard"><LayoutDashboard size={18} /> Dashboard</a>
				<a href="/settings"><Settings size={18} /> Nastavení</a>
				<form method="POST" action="/logout">
					<button type="submit" class="logout-btn"><LogOut size={18} /> Odhlásit</button>
				</form>
			{:else}
				<a href="/login"><LogIn size={18} /> Přihlásit</a>
				<a href="/register" class="btn"><UserPlus size={18} /> Registrace</a>
			{/if}
		</nav>
	</div>
</header>

<style>
	header {
		background-color: #1a1a1a;
		color: white;
		padding: 1rem 0;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.logo { display: flex; align-items: center; text-decoration: none; }
	.header-logo { height: 36px; width: auto; object-fit: contain; }
	nav { display: flex; align-items: center; gap: 1.5rem; }
	nav a { color: #ccc; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; transition: color 0.2s; }
	nav a:hover { color: #fff; }
	.btn { background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; }
	.btn:hover { background: #2563eb; color: white; }
	.logout-btn { background: none; border: none; color: #ef4444; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 1rem; padding: 0; }
	.logout-btn:hover { color: #dc2626; }
	form { margin: 0; }
</style>