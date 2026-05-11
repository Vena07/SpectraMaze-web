import { fail, redirect } from '@sveltejs/kit';
import { hash } from 'argon2';
import { generateIdFromEntropySize } from 'lucia';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { lucia } from '$lib/server/auth.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		const terms = formData.get('terms');

		if (!username || !email || password.length < 6) return fail(400, { error: 'Neplatné údaje' });
		if (!terms) return fail(400, { error: 'Musíte souhlasit s pravidly použití.' });

		const userId = generateIdFromEntropySize(10);
		const passwordHash = await hash(password);

		try {
			await db.insert(users).values({ id: userId, username, email, passwordHash });
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, { path: ".", ...sessionCookie.attributes });
		} catch (e) {
			return fail(400, { error: 'Uživatelské jméno nebo email již existuje.' });
		}

		throw redirect(302, '/dashboard');
	}
};