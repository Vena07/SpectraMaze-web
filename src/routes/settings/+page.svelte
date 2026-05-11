<script>
	import { enhance } from '$app/forms';
	import { Settings, Trash2, KeyRound } from 'lucide-svelte';
	let { data, form } = $props();
</script>

<div class="settings-card">
	<h1><Settings size={28} /> Nastavení účtu</h1>

	{#if form?.error} <div class="error">{form.error}</div> {/if}
	{#if form?.success} <div class="success">Úspěšně uloženo!</div> {/if}

	<form method="POST" action="?/updateBio" use:enhance class="bio-form">
		<h3>Profil</h3>
		<label for="bio">O mně (Bio)</label>
		<textarea id="bio" name="bio" rows="4">{data.user.bio || ''}</textarea>
		<button type="submit" class="btn">Uložit profil</button>
	</form>

	<hr />

	<div class="password-zone">
		<h3><KeyRound size={20} /> Změna hesla</h3>
		<form method="POST" action="?/changePassword" use:enhance>
			<div class="form-group">
				<label for="oldPassword">Současné heslo</label>
				<input id="oldPassword" name="oldPassword" type="password" required />
			</div>
			<div class="form-group">
				<label for="newPassword">Nové heslo (min. 6 znaků)</label>
				<input id="newPassword" name="newPassword" type="password" required minlength="6" />
			</div>
			<button type="submit" class="btn">Změnit heslo</button>
		</form>
	</div>

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
	.settings-card { max-width: 600px; margin: 2rem auto; background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; color: #f8fafc; }
	h1 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; }
	h3 { display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; color: #cbd5e1; }
	
	.form-group { margin-bottom: 1rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #94a3b8; }
	input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: white; resize: vertical; margin-bottom: 1rem; outline: none; }
	input:focus, textarea:focus { border-color: #3b82f6; }
	
	.btn { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
	.btn:hover { background: #2563eb; }
	
	hr { border: none; border-top: 1px solid #334155; margin: 2rem 0; }
	.error { color: #fca5a5; background: rgba(220,38,38,0.2); padding: 0.75rem; border-radius: 6px; border: 1px solid #ef4444; margin-bottom: 1rem; }
	.success { color: #86efac; background: rgba(34,197,94,0.2); padding: 0.75rem; border-radius: 6px; border: 1px solid #22c55e; margin-bottom: 1rem; }
	
	.danger-zone { border: 1px solid #ef4444; background: rgba(220,38,38,0.05); padding: 1.5rem; border-radius: 8px; }
	.danger-zone h3 { color: #ef4444; margin-top: 0; border-bottom-color: rgba(239,68,68,0.3); }
	.danger-zone p { margin-bottom: 1rem; color: #fca5a5; }
	
	.btn-danger { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer; }
</style>