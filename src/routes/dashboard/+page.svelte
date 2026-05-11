<script>
	import { enhance } from '$app/forms';
	import { 
		PlusCircle, Map as MapIcon, Eraser, Square, Gem, 
		Lightbulb, Redo2, Wand2, Shuffle, DoorClosed, 
		CircleDot, Palette, Split, MousePointer2, Waypoints, Edit2
	} from 'lucide-svelte';
	
	let { data, form } = $props();
	let addingMap = $state(false);
	let editingMapId = $state(null);
	let mapTitle = $state('');

	// Logika editoru map
	let gridSize = $state(6); // Defaultní velikost 6x6
	// Inicializace gridu s objekty místo stringů
	let grid = $state(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' }))));
	let selectedBlock = $state('wall');
	
	// Stavy pro chytré párování
	let pairStep = $state(0); // 0 = první blok (Tlačítko/Teleport A), 1 = druhý blok (Dveře/Teleport B)
	let currentPairId = $state(1);

	// Plovoucí popup pro barvy
	let popup = $state({ show: false, x: 0, y: 0, cellX: 0, cellY: 0, type: null });

	const paletteTools = [
		{ id: 'select', name: 'Kurzor (Upravit)', icon: MousePointer2, bg: '#ffffff', color: '#000000' },
		{ id: 'empty', name: 'Guma (Smazat)', icon: Eraser, bg: '#f1f5f9', color: '#94a3b8' },
		{ id: 'wall', name: 'Zeď', icon: Square, bg: '#334155', color: '#ffffff' },
		{ id: 'crystal', name: 'Krystal', icon: Gem, bg: '#eff6ff', color: '#3b82f6' },
		{ id: 'bulb', name: 'Žárovka', icon: Lightbulb, bg: '#fefce8', color: '#eab308' },
		{ id: 'mirror', name: 'Zrcadlo', icon: Redo2, bg: '#e0f2fe', color: '#0ea5e9' },
		{ id: 'mixer', name: 'Míchačka', icon: Wand2, bg: '#faf5ff', color: '#a855f7' },
		{ id: 'crossover', name: 'Průchod', icon: Shuffle, bg: '#fff7ed', color: '#f97316' },
		{ id: 'door_button', name: 'Pár: Tlačítko + Dveře', icon: DoorClosed, bg: '#fef3c7', color: '#d97706' },
		{ id: 'color_switch', name: 'Switch barev', icon: Palette, bg: '#fdf2f8', color: '#ec4899' },
		{ id: 'splitter', name: 'Rozdvojník', icon: Split, bg: '#f0fdf4', color: '#22c55e' },
		{ id: 'teleport_pair', name: 'Pár: Teleporty', icon: Waypoints, bg: '#fdf4ff', color: '#c026d3' }
	];

	// Zahrnuje i surové bloky, které nemají vlastní tlačítko v paletě
	const blockTypes = [
		...paletteTools,
		{ id: 'door', name: 'Dveře', icon: DoorClosed, bg: '#fef3c7', color: '#d97706' },
		{ id: 'button', name: 'Tlačítko', icon: CircleDot, bg: '#fef2f2', color: '#ef4444' },
		{ id: 'teleporter', name: 'Teleport', icon: Waypoints, bg: '#fdf4ff', color: '#c026d3' }
	];

	const colors = [
		{ value: '[255, 0, 0]', hex: '#ef4444', name: 'Červená' },
		{ value: '[0, 255, 0]', hex: '#22c55e', name: 'Zelená' },
		{ value: '[0, 0, 255]', hex: '#3b82f6', name: 'Modrá' }
	];
	const bulbColors = [
		...colors,
		{ value: '[255, 255, 0]', hex: '#eab308', name: 'Žlutá' },
		{ value: '[255, 0, 255]', hex: '#d946ef', name: 'Magenta' },
		{ value: '[0, 255, 255]', hex: '#06b6d4', name: 'Cyan' },
		{ value: '[255, 255, 255]', hex: '#f8fafc', name: 'Bílá' }
	];

	function getBlockInfo(id) { return blockTypes.find(b => b.id === id) || blockTypes[0]; }

	const idColors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#0ea5e9', '#ec4899', '#eab308', '#14b8a6', '#f43f5e'];

	// Funkce pro obarvení ikony podle nastavené RGB barvy v buňce
	function getIconColor(cell) {
		if (cell.color) {
			try {
				const [r, g, b] = JSON.parse(cell.color);
				return `rgb(${r}, ${g}, ${b})`;
			} catch(e) {}
		}
		if (cell.type === 'door' || cell.type === 'teleporter') {
			return idColors[(cell.id - 1) % idColors.length] || getBlockInfo(cell.type).color;
		}
		if (cell.type === 'button') {
			return idColors[(cell.link_id - 1) % idColors.length] || getBlockInfo(cell.type).color;
		}
		return getBlockInfo(cell.type).color;
	}

	// Funkce pro získání dalšího volného ID z herní plochy
	function getNextId() {
		let max = 0;
		grid.flat().forEach(c => {
			if (c.id > max) max = c.id;
			if (c.link_id > max) max = c.link_id;
		});
		return max + 1;
	}

	function openPopup(x, y, type) {
		popup = { show: true, cellX: x, cellY: y, type, x: x * 52 - 10, y: y * 52 + 54 };
	}

	function handleCellClick(x, y) {
		popup.show = false; // Vždy schovat popup při novém kliknutí

		if (selectedBlock === 'select') {
			if (['crystal', 'bulb', 'color_switch'].includes(grid[y][x].type)) {
				openPopup(x, y, grid[y][x].type);
			}
		} else if (selectedBlock === 'empty') {
			grid[y][x] = { type: 'empty' };
		} else if (selectedBlock === 'door_button') {
			if (pairStep === 0) {
				currentPairId = getNextId();
				grid[y][x] = { type: 'button', link_id: currentPairId };
				pairStep = 1;
			} else {
				grid[y][x] = { type: 'door', id: currentPairId };
				pairStep = 0;
			}
		} else if (selectedBlock === 'teleport_pair') {
			if (pairStep === 0) {
				currentPairId = getNextId();
				grid[y][x] = { type: 'teleporter', id: currentPairId };
				pairStep = 1;
			} else {
				grid[y][x] = { type: 'teleporter', id: currentPairId };
				pairStep = 0;
			}
		} else {
			grid[y][x] = { 
				type: selectedBlock,
				...(selectedBlock === 'crystal' ? { color: '[255, 0, 0]' } : {}),
				...(selectedBlock === 'bulb' ? { color: '[255, 0, 0]' } : {}),
				...(selectedBlock === 'color_switch' ? { color: '[255, 0, 0]' } : {})
			};
			if (['crystal', 'bulb', 'color_switch'].includes(selectedBlock)) openPopup(x, y, selectedBlock);
		}
	}

	// Načtení existující mapy do editoru pro úpravu
	function editMap(map) {
		addingMap = true;
		editingMapId = map.id;
		mapTitle = map.title;
		try {
			const parsed = JSON.parse(map.levelData);
			gridSize = parsed.size;
			grid = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' })));
			parsed.blocks.forEach(b => {
				let cell = { ...b };
				delete cell.x; delete cell.y;
				if (cell.color && Array.isArray(cell.color)) cell.color = JSON.stringify(cell.color);
				grid[b.y][b.x] = cell;
			});
		} catch (e) {}
	}

	// Funkce pro Drag & Drop přesouvání bloků
	function handleDragStart(e, x, y) {
		if (selectedBlock !== 'select' || grid[y][x].type === 'empty') { e.preventDefault(); return; }
		e.dataTransfer.setData('text/plain', JSON.stringify({ x, y }));
		popup.show = false;
	}

	function handleDrop(e, targetX, targetY) {
		e.preventDefault();
		const data = e.dataTransfer.getData('text/plain');
		if (!data) return;
		const source = JSON.parse(data);
		if (source.x === targetX && source.y === targetY) return;
		const temp = grid[targetY][targetX];
		grid[targetY][targetX] = grid[source.y][source.x];
		grid[source.y][source.x] = temp;
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

	// Vypočítá souřadnice pro vykreslení spojovacích čar mezi dveřmi, tlačítky a teleporty
	let connections = $derived((() => {
		const lines = [];
		const doors = [];
		const buttons = [];
		const teleporters = [];

		for (let y = 0; y < gridSize; y++) {
			for (let x = 0; x < gridSize; x++) {
				const cell = grid[y][x];
				if (cell.type === 'door') doors.push({ ...cell, x, y });
				if (cell.type === 'button') buttons.push({ ...cell, x, y });
				if (cell.type === 'teleporter') teleporters.push({ ...cell, x, y });
			}
		}

		buttons.forEach(b => {
			doors.forEach(d => {
				if (b.link_id === d.id) {
					lines.push({ x1: 30 + b.x * 52, y1: 30 + b.y * 52, x2: 30 + d.x * 52, y2: 30 + d.y * 52, color: idColors[(d.id - 1) % idColors.length] || '#fff' });
				}
			});
		});

		for (let i = 0; i < teleporters.length; i++) {
			for (let j = i + 1; j < teleporters.length; j++) {
				if (teleporters[i].id === teleporters[j].id) {
					lines.push({ x1: 30 + teleporters[i].x * 52, y1: 30 + teleporters[i].y * 52, x2: 30 + teleporters[j].x * 52, y2: 30 + teleporters[j].y * 52, color: idColors[(teleporters[i].id - 1) % idColors.length] || '#fff' });
				}
			}
		}
		
		return lines;
	})());
</script>

<div class="dashboard-header">
	<h1>Můj Dashboard</h1>
	<button class="btn" onclick={() => { addingMap = !addingMap; editingMapId = null; mapTitle = ''; grid = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' }))); }}>
		{#if addingMap} Zpět na seznam {:else} <PlusCircle size={20} /> Nová mapa {/if}
	</button>
</div>

{#if addingMap}
	<div class="add-map-card">
		<h2>{editingMapId ? 'Upravit mapu' : 'Vytvořit novou mapu'}</h2>
		{#if form?.error} <div class="error">{form.error}</div> {/if}
		
		<form method="POST" action={editingMapId ? '?/updateMap' : '?/createMap'} use:enhance={() => {
			return async ({ update, result }) => {
				await update();
				if (result.type === 'success') {
					addingMap = false;
					editingMapId = null;
					mapTitle = '';
					grid = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ({ type: 'empty' }))); // Reset editoru po uložení
					popup.show = false;
					pairStep = 0;
				}
			}
		}}>
			<input type="hidden" name="mapId" value={editingMapId || ''} />

			<div class="form-group">
				<label for="title">Název mapy</label>
				<input id="title" name="title" type="text" bind:value={mapTitle} placeholder="Např. Lávové peklo" required />
			</div>

			<div class="form-group">
				<label>Velikost herního pole ({gridSize}x{gridSize})</label>
				<input type="range" min="4" max="8" bind:value={gridSize} class="slider" />
			</div>

			<div class="editor-container">
				<div class="palette">
					<div class="palette-title">Nástroje:</div>
					{#each paletteTools as block}
						{@const Icon = block.icon}
						<button 
							type="button" class="tool-btn" class:active={selectedBlock === block.id}
							onclick={() => { selectedBlock = block.id; pairStep = 0; popup.show = false; }}
						>
							<Icon size={18} color={block.color} />
							{block.name}
						</button>
					{/each}
				</div>

				<div class="editor-main-area">
					{#if selectedBlock === 'door_button'}
						<div class="tool-banner door-banner">
							{pairStep === 0 ? 'Krok 1: Umístěte TLAČÍTKO' : 'Krok 2: Umístěte DVEŘE'}
						</div>
					{/if}
					{#if selectedBlock === 'teleport_pair'}
						<div class="tool-banner teleport-banner">
							{pairStep === 0 ? 'Krok 1: Umístěte PRVNÍ TELEPORT' : 'Krok 2: Umístěte DRUHÝ TELEPORT'}
						</div>
					{/if}

				<div class="grid-wrapper" style="grid-template-columns: repeat({gridSize}, 1fr);">
					<!-- Překryvná vrstva (SVG) pro vykreslování propojovacích čar -->
					<svg class="connection-lines" width={8 + gridSize * 52} height={8 + gridSize * 52}>
						{#each connections as line}
							<line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.color} stroke-width="4" stroke-dasharray="8,6" stroke-linecap="round" opacity="0.75" />
						{/each}
					</svg>

					{#each Array(gridSize) as _, y}
						{#each Array(gridSize) as _, x}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div 
								class="cell" 
								style="background-color: {getBlockInfo(grid[y][x].type).bg}" 
								onclick={() => handleCellClick(x, y)}
								draggable={selectedBlock === 'select' && grid[y][x].type !== 'empty'}
								ondragstart={(e) => handleDragStart(e, x, y)}
								ondrop={(e) => handleDrop(e, x, y)}
								ondragover={(e) => e.preventDefault()}
							>
								{#if grid[y][x].type !== 'empty'}
									{@const CellIcon = getBlockInfo(grid[y][x].type).icon}
									<CellIcon size={24} color={getIconColor(grid[y][x])} />
									{#if ['door', 'teleporter'].includes(grid[y][x].type)}
										<span class="id-badge" style="background-color: {getIconColor(grid[y][x])}">{grid[y][x].id}</span>
									{/if}
									{#if grid[y][x].type === 'button'}
										<span class="id-badge" style="background-color: {getIconColor(grid[y][x])}">{grid[y][x].link_id}</span>
									{/if}
								{/if}
							</div>
						{/each}
					{/each}

					<!-- Plovoucí popup s výběrem barev pro krystaly a žárovky -->
					{#if popup.show}
						<div class="color-popup" style="top: {popup.y}px; left: {popup.x}px;">
							<h4>Vyber barvu:</h4>
							<div class="color-options">
								{#each popup.type === 'crystal' ? colors : bulbColors as c}
									<button 
										type="button" class="color-dot" title={c.name}
										style="background-color: {c.hex};"
										onclick={() => { grid[popup.cellY][popup.cellX].color = c.value; popup.show = false; }}
									></button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
				</div>
			</div>

			<!-- Skrytý input odešle JSON bez toho, aby ho uživatel musel ručně kopírovat -->
			<input type="hidden" name="levelData" value={generatedJson} />
			<div class="preview-json"><strong>Výstupní JSON:</strong><code>{generatedJson}</code></div>

			<button type="submit" class="btn-submit">{editingMapId ? 'Uložit změny' : 'Nahrát do databáze'}</button>
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
				<div class="actions">
					<button class="btn-edit" onclick={() => editMap(map)}><Edit2 size={18} /> Upravit</button>
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

	.add-map-card { background: #1e293b; color: #f8fafc; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #334155; margin-bottom: 2rem; }
	.add-map-card h2 { margin-top: 0; }
	.form-group { margin-bottom: 1.5rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #cbd5e1; }
	input[type="text"] { width: 100%; padding: 0.75rem; border: 1px solid #475569; border-radius: 6px; font-family: inherit; background: #0f172a; color: white; outline: none; }
	.error { color: #dc2626; background: #fee2e2; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }

	/* Styly vizuálního editoru */
	.editor-container { display: grid; grid-template-columns: 250px 1fr; gap: 2rem; margin: 2rem 0; background: #0f172a; padding: 1.5rem; border-radius: 16px; border: 1px solid #334155; }
	.palette { display: flex; flex-direction: column; gap: 0.5rem; }
	.palette-title { font-weight: bold; margin-bottom: 0.75rem; text-transform: uppercase; font-size: 0.8rem; color: #64748b; letter-spacing: 0.05em; }
	.tool-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: none; background: transparent; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; font-size: 0.95rem; color: #475569; }
	.tool-btn:hover { background: #334155; color: #f8fafc; }
	.tool-btn.active { background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); color: #3b82f6; font-weight: 600; }
	
	.editor-main-area { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1e293b; border: 2px dashed #475569; border-radius: 12px; padding: 3rem 1rem; position: relative; min-height: 450px; }
	.tool-banner { position: absolute; top: 1.5rem; padding: 0.75rem 2rem; border-radius: 50px; font-weight: bold; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.15); animation: pulse 2s infinite; z-index: 10; }
	.door-banner { background: #d97706; } .teleport-banner { background: #c026d3; }
	@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.75; } 100% { opacity: 1; } }

	.grid-wrapper { display: grid; gap: 4px; background: #94a3b8; padding: 8px; border-radius: 12px; width: fit-content; height: fit-content; position: relative; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
	.connection-lines { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 1; }
	.cell { width: 48px; height: 48px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s, box-shadow 0.2s, filter 0.2s; user-select: none; position: relative; z-index: 2; }
	.cell:hover { filter: brightness(1.1); }
	.cell[draggable="true"] { cursor: grab; } .cell[draggable="true"]:active { cursor: grabbing; transform: scale(0.9); box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 20; }
	.id-badge { position: absolute; top: -6px; right: -6px; color: white; font-size: 0.7rem; font-weight: bold; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: 1px solid white; z-index: 5; }
	
	.color-popup { position: absolute; background: #1e293b; padding: 0.75rem; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 0 0 1px #334155; z-index: 30; min-width: 140px; }
	.color-popup h4 { margin: 0 0 0.5rem 0; font-size: 0.85rem; color: #cbd5e1; }
	.color-options { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.color-dot { width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer; transition: transform 0.1s; }
	.color-dot:hover { transform: scale(1.2); }
	
	.preview-json { background: #0f172a; color: #a5b4fc; padding: 1rem; border-radius: 6px; border: 1px solid #334155; font-family: monospace; font-size: 0.85rem; margin-bottom: 1.5rem; overflow-x: auto; }
	.preview-json strong { color: white; display: block; margin-bottom: 0.5rem; font-family: sans-serif; }
	.slider { width: 100%; margin-top: 0.5rem; cursor: pointer; }

	.my-maps h2 { margin-bottom: 1.5rem; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
	.map-card { display: flex; align-items: center; gap: 1rem; background: #1e293b; padding: 1rem; border-radius: 8px; border: 1px solid #334155; color: #f8fafc; }
	.icon-map { color: #3b82f6; }
	.details h3 { margin: 0 0 0.25rem 0; font-size: 1.1rem; } .details a { color: inherit; text-decoration: none; } .details a:hover { text-decoration: underline; color: #3b82f6; } .date { font-size: 0.85rem; color: #64748b; }
	.actions { margin-left: auto; }
	.btn-edit { background: transparent; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 6px; padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: bold; transition: all 0.2s; }
	.btn-edit:hover { background: rgba(59,130,246,0.1); }
</style>