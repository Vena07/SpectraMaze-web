<script>
	import { Search, Map as MapIcon } from 'lucide-svelte';
	let { data } = $props();
</script>

<div class="header-section">
	<h1>Prozkoumej mapy</h1>
	<form method="GET" class="search-form">
		<div class="search-bar">
			<Search size={20} class="icon" />
			<input type="text" name="q" placeholder="Hledat podle názvu nebo ID mapy..." value={data.query} />
			<button type="submit" class="btn">Hledat</button>
		</div>
	</form>
</div>

<div class="map-grid">
	{#if data.maps.length === 0}
		<p class="empty">Zatím nebyly nalezeny žádné mapy.</p>
	{:else}
		{#each data.maps as map}
			<a href="/maps/{map.id}" class="map-card">
				<div class="map-icon"><MapIcon size={32} /></div>
				<div class="map-info">
					<h2>{map.title}</h2>
					<p>Autor: <strong>{map.author || 'Neznámý'}</strong></p>
				</div>
			</a>
		{/each}
	{/if}
</div>

<style>
	.header-section { text-align: center; margin-bottom: 3rem; }
	h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }
	
	.search-form { max-width: 600px; margin: 0 auto; }
	.search-bar { display: flex; align-items: center; background: white; padding: 0.5rem; border-radius: 50px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
	:global(.search-bar .icon) { color: #64748b; margin-left: 1rem; }
	input { flex: 1; border: none; outline: none; padding: 0.75rem; font-size: 1rem; background: transparent; }
	.btn { background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: bold; cursor: pointer; }
	.btn:hover { background: #2563eb; }

	.map-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
	.map-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 12px; text-decoration: none; color: inherit; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
	.map-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
	
	.map-icon { background: #eff6ff; color: #3b82f6; padding: 1rem; border-radius: 12px; }
	.map-info h2 { margin: 0 0 0.25rem 0; font-size: 1.25rem; }
	.map-info p { margin: 0; color: #64748b; font-size: 0.9rem; }
	
	.empty { text-align: center; grid-column: 1 / -1; color: #64748b; font-size: 1.1rem; padding: 3rem 0; }
</style>