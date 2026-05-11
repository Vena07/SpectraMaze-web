<script>
	import { Copy, Check, Star, Square, Gem, Lightbulb, Redo2, Wand2, Shuffle, DoorClosed, CircleDot, Palette, Split, Waypoints } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	let { data } = $props();
	
	let copied = $state(false);

	function copyId() {
		navigator.clipboard.writeText(data.map.id);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	// Konstanty pro vykreslení náhledu mapy (Visualizer)
	const blockTypes = [
		{ id: 'wall', icon: Square, bg: '#334155', color: '#ffffff' },
		{ id: 'crystal', icon: Gem, bg: '#eff6ff', color: '#3b82f6' },
		{ id: 'bulb', icon: Lightbulb, bg: '#fefce8', color: '#eab308' },
		{ id: 'mirror', icon: Redo2, bg: '#e0f2fe', color: '#0ea5e9' },
		{ id: 'mixer', icon: Wand2, bg: '#faf5ff', color: '#a855f7' },
		{ id: 'crossover', icon: Shuffle, bg: '#fff7ed', color: '#f97316' },
		{ id: 'door', icon: DoorClosed, bg: '#fef3c7', color: '#d97706' },
		{ id: 'button', icon: CircleDot, bg: '#fef2f2', color: '#ef4444' },
		{ id: 'color_switch', icon: Palette, bg: '#fdf2f8', color: '#ec4899' },
		{ id: 'splitter', icon: Split, bg: '#f0fdf4', color: '#22c55e' },
		{ id: 'teleporter', icon: Waypoints, bg: '#fdf4ff', color: '#c026d3' }
	];
	const idColors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#0ea5e9', '#ec4899', '#eab308', '#14b8a6', '#f43f5e'];

	function getBlockInfo(id) { return blockTypes.find(b => b.id === id) || { bg: 'transparent', color: 'transparent' }; }
	function getIconColor(cell) {
		if (cell.color) { try { const [r,g,b] = cell.color; return `rgb(${r},${g},${b})`; } catch(e){} }
		if (cell.type === 'door' || cell.type === 'teleporter') return idColors[(cell.id - 1) % idColors.length] || getBlockInfo(cell.type).color;
		if (cell.type === 'button') return idColors[(cell.link_id - 1) % idColors.length] || getBlockInfo(cell.type).color;
		return getBlockInfo(cell.type).color;
	}

	// Překlad JSONu mapy do Gridu pro náhled
	let parsedLevel = $derived((() => {
		try {
			const parsed = JSON.parse(data.map.levelData);
			const mapGrid = Array.from({ length: parsed.size }, () => Array.from({ length: parsed.size }, () => ({ type: 'empty' })));
			const lines = [];
			const dArr = [], bArr = [], tArr = [];

			parsed.blocks.forEach(b => {
				mapGrid[b.y][b.x] = b;
				if (b.type === 'door') dArr.push(b);
				if (b.type === 'button') bArr.push(b);
				if (b.type === 'teleporter') tArr.push(b);
			});

			bArr.forEach(b => dArr.forEach(d => {
				if (b.link_id === d.id) lines.push({ x1: 30 + b.x * 52, y1: 30 + b.y * 52, x2: 30 + d.x * 52, y2: 30 + d.y * 52, color: idColors[(d.id - 1) % idColors.length] || '#fff' });
			}));
			for (let i = 0; i < tArr.length; i++) {
				for (let j = i + 1; j < tArr.length; j++) {
					if (tArr[i].id === tArr[j].id) lines.push({ x1: 30 + tArr[i].x * 52, y1: 30 + tArr[i].y * 52, x2: 30 + tArr[j].x * 52, y2: 30 + tArr[j].y * 52, color: idColors[(tArr[i].id - 1) % idColors.length] || '#fff' });
				}
			}
			return { size: parsed.size, grid: mapGrid, lines };
		} catch (e) {
			return null;
		}
	})());
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

	{#if parsedLevel}
		<div class="map-preview">
			<h3>Náhled herního pole</h3>
			<div class="grid-wrapper" style="grid-template-columns: repeat({parsedLevel.size}, 1fr);">
				<svg class="connection-lines" width={8 + parsedLevel.size * 52} height={8 + parsedLevel.size * 52}>
					{#each parsedLevel.lines as line}
						<line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.color} stroke-width="4" stroke-dasharray="8,6" opacity="0.6" />
					{/each}
				</svg>
				{#each Array(parsedLevel.size) as _, y}
					{#each Array(parsedLevel.size) as _, x}
						{@const cell = parsedLevel.grid[y][x]}
						<div class="cell" style="background-color: {getBlockInfo(cell.type).bg}">
							{#if cell.type !== 'empty'}
								{@const CellIcon = getBlockInfo(cell.type).icon}
								<CellIcon size={24} color={getIconColor(cell)} />
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
	{/if}

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
	/* Glassmorphism na hlavní kartě, aby prosvítaly hvězdy z layoutu */
	.map-detail-card { 
		max-width: 700px; 
		margin: 2rem auto; 
		background: rgba(15, 23, 42, 0.4); 
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		padding: 2.5rem; 
		border-radius: 12px; 
		box-shadow: 0 10px 30px rgba(0, 255, 255, 0.05); 
		border: 1px solid rgba(0, 255, 255, 0.15); 
		color: #f8fafc; 
	}

	header { text-align: center; margin-bottom: 2.5rem; }
	h1 { margin: 0 0 0.5rem 0; font-size: 2.5rem; }
	.author { color: #94a3b8; font-size: 1.1rem; margin: 0; text-shadow: 0 0 5px rgba(0,255,255,0.2); }
	
	/* Sekce ID v neonovém bloku */
	.id-block { 
		display: flex; justify-content: space-between; align-items: center; 
		background: rgba(0, 255, 255, 0.05); 
		color: #00ffff; 
		padding: 1.5rem; 
		border-radius: 8px; 
		margin-bottom: 2.5rem; 
		border: 1px solid rgba(0, 255, 255, 0.3); 
		box-shadow: 0 0 15px rgba(0, 255, 255, 0.1); 
	}
	.id-info { display: flex; flex-direction: column; gap: 0.5rem; }
	.label { font-size: 0.85rem; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; text-shadow: 0 0 5px rgba(14, 165, 233, 0.5); }
	.id-text { font-family: monospace; font-size: 1.25rem; word-break: break-all; color: #ffffff; text-shadow: 0 0 8px rgba(255,255,255,0.5); }
	.copy-btn { background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); color: #00ffff; padding: 0.75rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
	.copy-btn:hover { background: rgba(0, 255, 255, 0.25); box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }

	/* Holografický náhled mapy */
	.map-preview { 
		margin-bottom: 2.5rem; display: flex; flex-direction: column; align-items: center; 
		background: rgba(0, 0, 0, 0.3); padding: 2rem; border-radius: 12px; 
		border: 1px dashed rgba(0, 255, 255, 0.3); box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.05); 
	}
	.map-preview h3 { margin-top: 0; color: #00ffff; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; text-shadow: 0 0 8px rgba(0, 255, 255, 0.4); }
	.grid-wrapper { 
		display: grid; gap: 4px; background: rgba(15, 23, 42, 0.8); 
		padding: 8px; border-radius: 12px; width: fit-content; position: relative; 
		box-shadow: 0 0 20px rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.15); 
	}
	.connection-lines { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; }
	.cell { 
		width: 48px; height: 48px; border-radius: 6px; display: flex; align-items: center; 
		justify-content: center; position: relative; z-index: 2; 
		box-shadow: inset 0 0 10px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); 
	}

	/* Sekce hodnocení */
	.rating-block { border-top: 1px solid rgba(0, 255, 255, 0.15); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
	.avg-rating { display: flex; align-items: center; gap: 0.5rem; }
	.score { font-size: 1.25rem; font-weight: bold; text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }

	.rate-form { display: flex; align-items: center; gap: 0.75rem; }
	
	/* Výzva k přihlášení */
	.login-prompt { margin: 0; color: #94a3b8; }
	.login-prompt a { color: #00ffff; text-decoration: none; font-weight: bold; text-shadow: 0 0 5px rgba(0, 255, 255, 0.4); transition: all 0.3s; }
	.login-prompt a:hover { color: #ffffff; text-shadow: 0 0 10px #00ffff; }
</style>