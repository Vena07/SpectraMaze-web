<script>
	import { enhance } from '$app/forms';
	import { LogIn } from 'lucide-svelte';
	let { form } = $props();
</script>

<div class="auth-card">
	<h1><LogIn size={24} /> Přihlášení</h1>
	
	{#if form?.error}
		<div class="error">{form.error}</div>
	{/if}

	<form method="POST" use:enhance>
		<div class="form-group">
			<label for="username">Uživatelské jméno</label>
			<input id="username" name="username" type="text" required />
		</div>
		<div class="form-group">
			<label for="password">Heslo</label>
			<input id="password" name="password" type="password" required />
		</div>
		<button type="submit" class="btn">Přihlásit se</button>
	</form>
</div>

<style>
	.auth-card { max-width: 400px; margin: 4rem auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; color: #f8fafc; }
	h1 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; margin-bottom: 1.5rem; }
	.form-group { margin-bottom: 1rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #cbd5e1; }
	input { width: 100%; padding: 0.75rem; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: white; outline: none; transition: border-color 0.2s; }
	input:focus { border-color: #3b82f6; }
	.btn { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; margin-top: 1rem; font-weight: bold; transition: background 0.2s; }
	.btn:hover { background: #2563eb; }
	.error { color: #fca5a5; background: rgba(220,38,38,0.2); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #ef4444; }
</style>