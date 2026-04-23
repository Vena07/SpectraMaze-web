<script>
	import { Copy, Check, Star } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
	
	let copied = $state(false);

	function copyId() {
		navigator.clipboard.writeText(data.map.id);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<div class="map-detail-card">
	<header>
		<h1>{data.map.title}</h1>
		<p class="author">Vytvořil: <strong>{data.map.author || 'Neznámý'}</strong></p>
	</header>

	<div class="id-block">
		<div class="id-info">
			<span class="label">ID Mapy (pro načtení ve hře):</span>
			<code class="id-text">{data.map.id}</code>
		</div>
		<button onclick={copyId} class="copy-btn" title="Kopírovat ID">
			{#if copied} <Check size={20} color="#10b981"/> {:else} <Copy size={20} /> {/if}
		</button>
	</div>

	<div class="rating-block">
		<div class="avg-rating">
			<Star fill="#eab308" color="#eab308" size={24} />
			<span class="score">{data.avgRating} / 5</span>
		</div>

		{#if data.user}
			<form method="POST" action="?/rate" use:enhance class="rate-form">
				<span>Tvé hodnocení:</span>
				<select name="stars" required>
					<option value="" disabled selected={!data.userRating}>Vyber...</option>
					{#each [1,2,3,4,5] as star}
						<option value={star} selected={data.userRating === star}>{star} hvězd</option>
					{/each}
				</select>
				<button type="submit" class="btn">Ohodnotit</button>
			</form>
		{:else}
			<p class="login-prompt"><a href="/login">Přihlas se</a> a ohodnoť tuto mapu.</p>
		{/if}
	</div>
</div>

<style>
	.map-detail-card { max-width: 700px; margin: 2rem auto; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
	header { text-align: center; margin-bottom: 2.5rem; }
	h1 { margin: 0 0 0.5rem 0; font-size: 2.5rem; }
	.author { color: #64748b; font-size: 1.1rem; margin: 0; }
	
	.id-block { display: flex; justify-content: space-between; align-items: center; background: #1e293b; color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2.5rem; }
	.id-info { display: flex; flex-direction: column; gap: 0.5rem; }
	.label { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; }
	.id-text { font-family: monospace; font-size: 1.25rem; word-break: break-all; }
	.copy-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 0.75rem; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
	.copy-btn:hover { background: rgba(255,255,255,0.2); }

	.rating-block { border-top: 1px solid #e2e8f0; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
	.avg-rating { display: flex; align-items: center; gap: 0.5rem; }
	.score { font-size: 1.25rem; font-weight: bold; }

	.rate-form { display: flex; align-items: center; gap: 0.75rem; }
	select { padding: 0.5rem; border-radius: 6px; border: 1px solid #ccc; font-size: 1rem; }
	.btn { padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
	.btn:hover { background: #2563eb; }
	
	.login-prompt { margin: 0; color: #64748b; }
	.login-prompt a { color: #3b82f6; text-decoration: none; font-weight: bold; }
</style>