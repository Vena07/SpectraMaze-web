<script>
	import { enhance } from '$app/forms';
	import { Settings, Trash2 } from 'lucide-svelte';
	let { data } = $props();
</script>

<div class="settings-card">
	<h1><Settings size={28} /> Nastavení účtu</h1>

	<form method="POST" action="?/updateBio" use:enhance class="bio-form">
		<label for="bio">O mně (Bio)</label>
		<textarea id="bio" name="bio" rows="4">{data.user.bio || ''}</textarea>
		<button type="submit" class="btn">Uložit profil</button>
	</form>

	<hr />

	<div class="danger-zone">
		<h3>Nebezpečná zóna</h3>
		<p>Smazání účtu je trvalé a odstraní všechny vaše mapy i hodnocení.</p>
		<form method="POST" action="?/deleteAccount" use:enhance={({ cancel }) => {
			if (!confirm('Opravdu chcete nenávratně smazat svůj účet?')) cancel();
		}}>
			<button type="submit" class="btn-danger"><Trash2 size={18} /> Smazat účet</button>
		</form>
	</div>
</div>

<style>
	.settings-card { max-width: 600px; margin: 2rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
	h1 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; }
	.bio-form { margin-bottom: 2rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
	textarea { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; resize: vertical; margin-bottom: 1rem; }
	
	.btn { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
	
	hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
	
	.danger-zone { border: 1px solid #fecaca; background: #fef2f2; padding: 1.5rem; border-radius: 8px; }
	.danger-zone h3 { color: #dc2626; margin-top: 0; }
	.danger-zone p { margin-bottom: 1rem; color: #7f1d1d; }
	
	.btn-danger { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; }
	.btn-danger:hover { background: #b91c1c; }
</style>