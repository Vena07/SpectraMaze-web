<script>
	// Zde může být v budoucnu logika pro načítání dat z API apod.
</script>

<svelte:head>
	<title>SpectraMaze | Sci-fi Laser Puzzle Game</title>
	<meta name="description" content="Logická 2D sci-fi hra v Pythonu založená na míchání barev a manipulaci s lasery." />
</svelte:head>

<main class="space-background">
	<div class="stars"></div>
	
	<div class="container">
		<!-- Hero Sekce -->
		<header class="hero glass-panel">
			<img src="/logo.png" alt="SpectraMaze Logo" class="logo" />
			<h1>SpectraMaze</h1>
			<p class="subtitle">
				Ponořte se do hlubokého vesmíru. Dostaňte barevné laserové paprsky ze zdrojových krystalů do cílových žárovek pomocí aditivního míchání světla.
			</p>
			<div class="actions">
				<a href="#instalace" class="btn btn-primary">Stáhnout a hrát</a>
				<a href="/editor" class="btn btn-secondary">Webový editor map</a>
			</div>
		</header>

		<!-- Hlavní funkce -->
		<section class="features">
			<h2 class="section-title">Hlavní funkce</h2>
			<div class="grid">
				<div class="card glass-panel">
					<div class="icon neon-blue">🌐</div>
					<h3>Propojení s webem</h3>
					<p>Tvořte vlastní mapy ve webovém editoru. Mapy se ukládají ve formátu JSON a plynule se načítají do herního klienta přes API.</p>
				</div>
				<div class="card glass-panel">
					<div class="icon neon-purple">🧠</div>
					<h3>Procedurální AI generátor</h3>
					<p>Komplexní algoritmus garantuje řešitelnost náhodně generovaných hádanek ve třech úrovních obtížnosti.</p>
				</div>
				<div class="card glass-panel">
					<div class="icon neon-green">🎵</div>
					<h3>Vlastní audio syntezátor</h3>
					<p>Žádné samply. Veškeré zvuky jsou v reálném čase matematicky generovány pomocí upraveného pitch-bend enginu.</p>
				</div>
				<div class="card glass-panel">
					<div class="icon neon-cyan">✨</div>
					<h3>Glassmorphism UI</h3>
					<p>Animované paralaxní hvězdné nebe, pulzující neonové prvky a vizuální "skleněné" efekty herního pole.</p>
				</div>
			</div>
		</section>

		<!-- Míchání barev -->
		<section class="color-mixing glass-panel">
			<h2 class="section-title">Logika míchání barev (RGB)</h2>
			<p>Hra simuluje fyzikální optické chování aditivního míchání světla. Najděte správnou kombinaci k vyřešení hádanek:</p>
			<div class="mix-grid">
				<div class="mix-item">
					<span class="dot red"></span> + <span class="dot green"></span> = <span class="dot yellow"></span>
					<span class="mix-text">Žlutá</span>
				</div>
				<div class="mix-item">
					<span class="dot red"></span> + <span class="dot blue"></span> = <span class="dot magenta"></span>
					<span class="mix-text">Magenta</span>
				</div>
				<div class="mix-item">
					<span class="dot green"></span> + <span class="dot blue"></span> = <span class="dot cyan"></span>
					<span class="mix-text">Azurová</span>
				</div>
				<div class="mix-item">
					<span class="dot red"></span> + <span class="dot green"></span> + <span class="dot blue"></span> = <span class="dot white"></span>
					<span class="mix-text">Bílá</span>
				</div>
			</div>
		</section>

		<!-- Herní bloky (OOP) -->
		<section class="blocks">
			<h2 class="section-title">Herní prvky (OOP Architektura)</h2>
			<p class="section-desc">Kompletně objektově orientovaný návrh. Každý blok dědí z <code>BaseBlock</code> a nabízí unikátní interakci s laserem.</p>
			
			<div class="grid blocks-grid">
				<div class="card glass-panel mini">
					<h4>💎 Krystal & 💡 Žárovka</h4>
					<p>Krystal slouží jako zdroj primárních paprsků (R, G, B). Žárovka je koncový cíl vyžadující přesnou barvu.</p>
				</div>
				<div class="card glass-panel mini">
					<h4>🪞 Zrcadlo & 🔀 Rozdvojník</h4>
					<p>Zrcadlo odráží paprsek striktně o 90°. Rozdvojník tříští energii do více směrů.</p>
				</div>
				<div class="card glass-panel mini">
					<h4>🌪️ Mixér & 🎨 Měnič barev</h4>
					<p>Mixér provádí aditivní sloučení. Měnič barev vnutí průchozímu paprsku svou vlastní barvu.</p>
				</div>
				<div class="card glass-panel mini">
					<h4>🚪 Dveře & 🔘 Tlačítko</h4>
					<p>Systém logických spínačů pro uvolnění cesty přes reference objektů.</p>
				</div>
			</div>
		</section>

		<!-- Instalace -->
		<section id="instalace" class="installation glass-panel">
			<h2 class="section-title">Instalace a spuštění</h2>
			<div class="code-block">
				<p class="comment"># Naklonujte si repozitář</p>
				<code>git clone https://github.com/vasin/SpectraMaze.git</code>
				<code>cd SpectraMaze</code>
				<br>
				<p class="comment"># Nainstalujte závislosti (K běhu je zapotřebí pygame a requests)</p>
				<code>pip install pygame requests</code>
				<br>
				<p class="comment"># Spusťte hru</p>
				<code>python main.py</code>
			</div>
		</section>
	</div>
	
	<footer>
		<p>Vytvořeno jako maturitní/ročníkový projekt se zaměřením na OOP v Pythonu.</p>
		<a href="https://github.com/vasin/SpectraMaze" target="_blank">Zobrazit na GitHubu</a>
	</footer>
</main>

<style>
	/* Základní barvy a proměnné */
	:root {
		--bg-color: #050510;
		--text-main: #e0e0ff;
		--glass-bg: rgba(20, 20, 40, 0.4);
		--glass-border: rgba(255, 255, 255, 0.1);
		
		/* Neonové barvy pro paprsky a UI */
		--c-red: #ff2a2a;
		--c-green: #2aff2a;
		--c-blue: #2a2aff;
		--c-yellow: #ffff2a;
		--c-magenta: #ff2aff;
		--c-cyan: #2affff;
		--c-white: #ffffff;
	}

	/* Vesmírné pozadí */
	.space-background {
		min-height: 100vh;
		background: radial-gradient(circle at 50% 50%, #110922 0%, #050510 100%);
		color: var(--text-main);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		position: relative;
		overflow-x: hidden;
	}

	/* Kontejner pro obsah */
	.container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 40px 20px;
		position: relative;
		z-index: 10;
	}

	/* Glassmorphism panel */
	.glass-panel {
		background: var(--glass-bg);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--glass-border);
		border-radius: 16px;
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	}

	/* Typografie */
	h1 {
		font-size: 4rem;
		margin: 20px 0;
		background: linear-gradient(90deg, var(--c-cyan), var(--c-magenta));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 20px rgba(42, 255, 255, 0.3);
	}

	.section-title {
		font-size: 2.2rem;
		margin-bottom: 30px;
		text-align: center;
		color: var(--c-white);
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
	}

	.section-desc {
		text-align: center;
		margin-bottom: 40px;
		color: #a0a0c0;
	}

	/* Hero Sekce */
	.hero {
		text-align: center;
		padding: 60px 20px;
		margin-bottom: 60px;
	}

	.logo {
		max-width: 180px;
		height: auto;
		filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
	}

	.subtitle {
		font-size: 1.2rem;
		max-width: 700px;
		margin: 0 auto 40px;
		line-height: 1.6;
		color: #b0b0d0;
	}

	/* Tlačítka */
	.actions {
		display: flex;
		gap: 20px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		padding: 12px 30px;
		border-radius: 8px;
		text-decoration: none;
		font-weight: bold;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.btn-primary {
		background: var(--c-cyan);
		color: #000;
		box-shadow: 0 0 15px rgba(42, 255, 255, 0.4);
	}

	.btn-primary:hover {
		box-shadow: 0 0 25px rgba(42, 255, 255, 0.7);
		transform: translateY(-2px);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: var(--c-white);
		border: 1px solid var(--glass-border);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	/* Grid a Karty */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 25px;
		margin-bottom: 60px;
	}

	.card {
		padding: 30px;
		text-align: center;
		transition: transform 0.3s ease;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	.card h3 {
		margin: 15px 0;
		color: var(--c-white);
	}

	.card p {
		color: #a0a0c0;
		line-height: 1.5;
		font-size: 0.95rem;
	}

	.icon {
		font-size: 2.5rem;
		margin-bottom: 15px;
	}

	/* Míchání barev */
	.color-mixing {
		padding: 40px;
		margin-bottom: 60px;
		text-align: center;
	}

	.mix-grid {
		display: flex;
		justify-content: center;
		gap: 40px;
		flex-wrap: wrap;
		margin-top: 30px;
	}

	.mix-item {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.dot {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		display: inline-block;
		box-shadow: 0 0 10px currentColor;
	}

	.red { background: var(--c-red); color: var(--c-red); }
	.green { background: var(--c-green); color: var(--c-green); }
	.blue { background: var(--c-blue); color: var(--c-blue); }
	.yellow { background: var(--c-yellow); color: var(--c-yellow); }
	.magenta { background: var(--c-magenta); color: var(--c-magenta); }
	.cyan { background: var(--c-cyan); color: var(--c-cyan); }
	.white { background: var(--c-white); color: var(--c-white); }

	.mix-text {
		font-size: 1.1rem;
		color: #e0e0ff;
		margin-left: 10px;
	}

	/* Instalace */
	.installation {
		padding: 40px;
		margin-bottom: 60px;
	}

	.code-block {
		background: rgba(0, 0, 0, 0.5);
		padding: 20px;
		border-radius: 8px;
		font-family: 'Courier New', Courier, monospace;
		text-align: left;
		max-width: 600px;
		margin: 0 auto;
	}

	.code-block code {
		display: block;
		color: var(--c-cyan);
		margin-bottom: 5px;
	}

	.code-block .comment {
		color: #6a6a8a;
		margin: 15px 0 5px 0;
	}
	.code-block .comment:first-child { margin-top: 0; }

	/* Footer */
	footer {
		text-align: center;
		padding: 40px 20px;
		border-top: 1px solid var(--glass-border);
		background: rgba(0, 0, 0, 0.3);
	}

	footer a {
		color: var(--c-cyan);
		text-decoration: none;
		margin-top: 10px;
		display: inline-block;
	}
	
	footer a:hover { text-decoration: underline; }
</style>