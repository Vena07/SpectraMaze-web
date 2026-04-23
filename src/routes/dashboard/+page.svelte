<script>
	import { enhance } from '$app/forms';
	import { 
		PlusCircle, Map as MapIcon, Eraser, Square, Gem, 
		Lightbulb, Redo2, Wand2, Shuffle, DoorClosed, 
		CircleDot, Palette, Split, MousePointer2, Waypoints
	} from 'lucide-svelte';
	
	let { data, form } = $props();
	let addingMap = $state(false);

	// Logika editoru map
	let gridSize = $state(6); // Defaultní velikost 6x6
	// Inicializace gridu s objekty místo stringů
	let grid = $state(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' }))));
	let selectedBlock = $state('wall');
	let selectedCell = $state(null);

	const blockTypes = [
		{ id: 'select', name: 'Kurzor (Upravit)', icon: MousePointer2, bg: '#ffffff', color: '#000000' },
		{ id: 'empty', name: 'Guma (Smazat)', icon: Eraser, bg: '#f1f5f9', color: '#94a3b8' },
		{ id: 'wall', name: 'Zeď', icon: Square, bg: '#334155', color: '#ffffff' },
		{ id: 'crystal', name: 'Krystal', icon: Gem, bg: '#eff6ff', color: '#3b82f6' },
		{ id: 'bulb', name: 'Žárovka', icon: Lightbulb, bg: '#fefce8', color: '#eab308' },
		{ id: 'mirror', name: 'Zrcadlo', icon: Redo2, bg: '#e0f2fe', color: '#0ea5e9' },
		{ id: 'mixer', name: 'Míchačka', icon: Wand2, bg: '#faf5ff', color: '#a855f7' },
		{ id: 'crossover', name: 'Průchod', icon: Shuffle, bg: '#fff7ed', color: '#f97316' },
		{ id: 'door', name: 'Dveře', icon: DoorClosed, bg: '#fef3c7', color: '#d97706' },
		{ id: 'button', name: 'Tlačítko', icon: CircleDot, bg: '#fef2f2', color: '#ef4444' },
		{ id: 'color_switch', name: 'Switch barev', icon: Palette, bg: '#fdf2f8', color: '#ec4899' },
		{ id: 'splitter', name: 'Rozdvojník', icon: Split, bg: '#f0fdf4', color: '#22c55e' },
		{ id: 'teleporter', name: 'Teleport', icon: Waypoints, bg: '#fdf4ff', color: '#c026d3' }
	];

	function getBlockInfo(id) { return blockTypes.find(b => b.id === id) || blockTypes[0]; }

	// Funkce pro obarvení ikony podle nastavené RGB barvy v buňce
	function getIconColor(cell) {
		if (cell.color) {
			try {
				const [r, g, b] = JSON.parse(cell.color);
				return `rgb(${r}, ${g}, ${b})`;
			} catch(e) {}
		}
		return getBlockInfo(cell.type).color;
	}

	function handleCellClick(x, y) {
		if (selectedBlock === 'select') {
			if (grid[y][x].type !== 'empty') selectedCell = { x, y };
			else selectedCell = null;
		} else if (selectedBlock === 'empty') {
			grid[y][x] = { type: 'empty' };
			if (selectedCell?.x === x && selectedCell?.y === y) selectedCell = null;
		} else {
			// Pokud pokládáme stejný blok, jen ho vybereme (nepřemažeme existující vlastnosti)
			if (grid[y][x].type === selectedBlock) {
				selectedCell = { x, y };
				return;
			}
			grid[y][x] = { 
				type: selectedBlock,
				...(selectedBlock === 'crystal' ? { color: '[255, 0, 0]' } : {}),
				...(selectedBlock === 'bulb' ? { color: '[255, 0, 0]' } : {}),
				...(['mirror', 'splitter'].includes(selectedBlock) ? { orientation: 0 } : {}),
				...(selectedBlock === 'button' ? { link_id: 1 } : {}),
				...(['door', 'teleporter'].includes(selectedBlock) ? { id: 1 } : {})
			};
			selectedCell = { x, y };
		}
	}

	// Automaticky překládá vizuální grid na JSON string pro databázi a API (a zahodí prázdná políčka)
	let generatedJson = $derived(JSON.stringify({
		size: gridSize,
		blocks: grid.slice(0, gridSize).flatMap((row, y) =>
			row.slice(0, gridSize)
				.map((cell, x) => {
					let b = { ...cell, x, y };
					if (b.color) b.color = JSON.parse(b.color); // Převod ze stringu "[255,0,0]" zpět na pole [255,0,0]
					return b;
				})
				.filter(b => b.type !== 'empty')
		)
	}));
</script>

<div class="dashboard-header">
	<h1>Můj Dashboard</h1>
	<button class="btn" onclick={() => addingMap = !addingMap}>
		<PlusCircle size={20} />
		Nová mapa
	</button>
</div>

{#if addingMap}
	<div class="add-map-card">
		<h2>Vytvořit novou mapu</h2>
		{#if form?.error} <div class="error">{form.error}</div> {/if}
		
		<form method="POST" action="?/createMap" use:enhance={() => {
			return async ({ update, result }) => {
				await update();
				if (result.type === 'success') {
					addingMap = false;
					grid = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' }))); // Reset editoru po uložení
					selectedCell = null;
				}
			}
		}}>
			<div class="form-group">
				<label for="title">Název mapy</label>
				<input id="title" name="title" type="text" placeholder="Např. Lávové peklo" required />
			</div>

			<div class="form-group">
				<label>Velikost herního pole ({gridSize}x{gridSize})</label>
				<input type="range" min="4" max="8" bind:value={gridSize} class="slider" />
			</div>

			<div class="editor-container">
				<div class="palette">
					<div class="palette-title">Nástroje:</div>
					{#each blockTypes as block}
						{@const Icon = block.icon}
						<button 
							type="button" class="tool-btn" class:active={selectedBlock === block.id}
							onclick={() => selectedBlock = block.id}
						>
							<Icon size={18} color={block.color} />
							{block.name}
						</button>
					{/each}
				</div>

				<div class="grid-wrapper" style="grid-template-columns: repeat({gridSize}, 1fr);">
					{#each Array(gridSize) as _, y}
						{#each Array(gridSize) as _, x}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div 
								class="cell" 
								class:selected={selectedCell?.x === x && selectedCell?.y === y}
								style="background-color: {getBlockInfo(grid[y][x].type).bg}" 
								onclick={() => handleCellClick(x, y)}
							>
								{#if grid[y][x].type !== 'empty'}
									{@const CellIcon = getBlockInfo(grid[y][x].type).icon}
									<CellIcon size={24} color={getIconColor(grid[y][x])} />
								{/if}
							</div>
						{/each}
					{/each}
				</div>

				<!-- Panel vlastností pro vybraný blok -->
				{#if selectedCell && grid[selectedCell.y][selectedCell.x].type !== 'empty'}
					<div class="properties-panel">
						<h3>Vlastnosti: {getBlockInfo(grid[selectedCell.y][selectedCell.x].type).name}</h3>
						
						{#if grid[selectedCell.y][selectedCell.x].type === 'crystal'}
							<div class="prop-group">
								<label>Barva RGB</label>
								<select bind:value={grid[selectedCell.y][selectedCell.x].color}>
									<option value="[255, 0, 0]">Červená</option>
									<option value="[0, 255, 0]">Zelená</option>
									<option value="[0, 0, 255]">Modrá</option>
								</select>
							</div>
						{/if}

						{#if grid[selectedCell.y][selectedCell.x].type === 'bulb'}
							<div class="prop-group">
								<label>Cílová barva RGB</label>
								<select bind:value={grid[selectedCell.y][selectedCell.x].color}>
									<option value="[255, 0, 0]">Červená</option>
									<option value="[0, 255, 0]">Zelená</option>
									<option value="[0, 0, 255]">Modrá</option>
									<option value="[255, 255, 0]">Žlutá (R+G)</option>
									<option value="[255, 0, 255]">Magenta (R+B)</option>
									<option value="[0, 255, 255]">Cyan (G+B)</option>
									<option value="[255, 255, 255]">Bílá (R+G+B)</option>
								</select>
							</div>
						{/if}

						{#if grid[selectedCell.y][selectedCell.x].type === 'button'}
							<div class="prop-group">
								<label>Link ID (propojení s dveřmi)</label>
								<input type="number" min="1" bind:value={grid[selectedCell.y][selectedCell.x].link_id} />
							</div>
						{/if}

						{#if grid[selectedCell.y][selectedCell.x].type === 'door'}
							<div class="prop-group">
								<label>ID dveří (odpovídá tlačítku)</label>
								<input type="number" min="1" bind:value={grid[selectedCell.y][selectedCell.x].id} />
							</div>
						{/if}

						{#if grid[selectedCell.y][selectedCell.x].type === 'teleporter'}
							<div class="prop-group">
								<label>ID Teleportu (pro spárování)</label>
								<input type="number" min="1" bind:value={grid[selectedCell.y][selectedCell.x].id} />
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Skrytý input odešle JSON bez toho, aby ho uživatel musel ručně kopírovat -->
			<input type="hidden" name="levelData" value={generatedJson} />
			<div class="preview-json"><strong>Výstupní JSON:</strong><code>{generatedJson}</code></div>

			<button type="submit" class="btn-submit">Nahrát do databáze</button>
		</form>
	</div>
{/if}

<div class="my-maps">
	<h2>Moje nahrané mapy ({data.maps.length})</h2>
	<div class="grid">
		{#each data.maps as map}
			<div class="map-card">
				<MapIcon size={32} class="icon-map" />
				<div class="details">
					<a href="/maps/{map.id}"><h3>{map.title}</h3></a>
					<span class="date">{new Date(map.createdAt).toLocaleDateString()}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
	h1 { margin: 0; }
	
	.btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
	.btn:hover { background: #2563eb; }
	.btn-submit { width: 100%; padding: 0.75rem; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; }
	.btn-submit:hover { background: #059669; }

	.add-map-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 2rem; }
	.add-map-card h2 { margin-top: 0; }
	.form-group { margin-bottom: 1.5rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
	input[type="text"] { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-family: inherit; }
	.error { color: #dc2626; background: #fee2e2; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }

	/* Styly vizuálního editoru */
	.editor-container { display: flex; flex-wrap: wrap; gap: 2rem; margin: 1.5rem 0; }
	.palette { display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px; }
	.palette-title { font-weight: bold; margin-bottom: 0.5rem; }
	.tool-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid #e2e8f0; background: white; border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.2s; font-size: 0.9rem; }
	.tool-btn:hover { background: #f8fafc; }
	.tool-btn.active { border-color: #3b82f6; background: #eff6ff; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
	.grid-wrapper { display: grid; gap: 4px; background: #94a3b8; padding: 6px; border-radius: 8px; width: fit-content; height: fit-content; }
	.cell { width: 48px; height: 48px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s; user-select: none; }
	.cell:active { transform: scale(0.9); }
	.cell.selected { box-shadow: 0 0 0 3px #ef4444; z-index: 10; position: relative; }
	.preview-json { background: #1e293b; color: #a5b4fc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.85rem; margin-bottom: 1.5rem; overflow-x: auto; }
	.preview-json strong { color: white; display: block; margin-bottom: 0.5rem; font-family: sans-serif; }
	.slider { width: 100%; margin-top: 0.5rem; cursor: pointer; }

	.properties-panel { background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; min-width: 250px; flex: 1; height: fit-content; }
	.properties-panel h3 { margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.5rem; }
	.prop-group { margin-bottom: 1rem; }
	.prop-group label { font-size: 0.85rem; color: #475569; }
	.prop-group input, .prop-group select { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; margin-top: 0.25rem; }

	.my-maps h2 { margin-bottom: 1.5rem; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
	.map-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
	.icon-map { color: #3b82f6; }
	.details h3 { margin: 0 0 0.25rem 0; font-size: 1.1rem; } .details a { color: inherit; text-decoration: none; } .details a:hover { text-decoration: underline; color: #3b82f6; } .date { font-size: 0.85rem; color: #64748b; }
</style>