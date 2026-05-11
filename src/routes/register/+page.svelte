<script>
	import { enhance } from '$app/forms';
	import { UserPlus } from 'lucide-svelte';
	let { form } = $props();
</script>

<div class="auth-card">
	<h1><UserPlus size={24} /> Registrace</h1>
	
	{#if form?.error}
		<div class="error">{form.error}</div>
	{/if}

	<form method="POST" use:enhance>
		<div class="form-group">
			<label for="username">Uživatelské jméno</label>
			<input id="username" name="username" type="text" required />
		</div>
		<div class="form-group">
			<label for="email">E-mail</label>
			<input id="email" name="email" type="email" required />
		</div>
		<div class="form-group">
			<label for="password">Heslo</label>
			<input id="password" name="password" type="password" required minlength="6" />
		</div>
		<div class="form-group terms-group">
			<input id="terms" name="terms" type="checkbox" required />
			<label for="terms">Souhlasím s <a href="/terms" target="_blank" class="link">Podmínkami použití</a></label>
		</div>
		<button type="submit" class="btn">Zaregistrovat se</button>
	</form>
</div>

<style>
	.auth-card { max-width: 400px; margin: 4rem auto; background: #1e293b; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; color: #f8fafc; }
	h1 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; margin-bottom: 1.5rem; }
	.form-group { margin-bottom: 1rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #cbd5e1; }
	input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 0.75rem; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: white; outline: none; transition: border-color 0.2s; }
	input:focus { border-color: #3b82f6; }
	.terms-group { display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; }
	.terms-group input { width: auto; }
	.terms-group label { margin: 0; font-weight: normal; font-size: 0.9rem; }
	.link { color: #60a5fa; text-decoration: none; } .link:hover { text-decoration: underline; }
	.btn { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; margin-top: 1rem; font-weight: bold; transition: background 0.2s; }
	.btn:hover { background: #2563eb; }
	.error { color: #fca5a5; background: rgba(220,38,38,0.2); padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #ef4444; }
</style>