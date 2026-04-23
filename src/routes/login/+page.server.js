import { fail, redirect } from '@sveltejs/kit';
import { verify } from 'argon2';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { lucia } from '$lib/server/auth.js';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) return fail(400, { error: 'Vyplňte obě pole.' });

		const existingUsers = await db.select().from(users).where(eq(users.username, username));
		const existingUser = existingUsers[0];

		if (!existingUser) return fail(400, { error: 'Nesprávné jméno nebo heslo.' });

		const validPassword = await verify(existingUser.passwordHash, password);
		if (!validPassword) return fail(400, { error: 'Nesprávné jméno nebo heslo.' });

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, { path: ".", ...sessionCookie.attributes });
		throw redirect(302, '/dashboard');
	}
};