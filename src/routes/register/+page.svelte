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
		<button type="submit" class="btn">Zaregistrovat se</button>
	</form>
</div>

<style>
	.auth-card { max-width: 400px; margin: 4rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
	h1 { display: flex; align-items: center; gap: 0.5rem; margin-top: 0; }
	.form-group { margin-bottom: 1rem; }
	label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
	input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
	.btn { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; margin-top: 1rem; }
	.error { color: #dc2626; background: #fee2e2; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
</style>