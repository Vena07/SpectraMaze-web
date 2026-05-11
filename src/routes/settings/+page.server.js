import { fail, redirect } from '@sveltejs/kit';
import { hash, verify } from 'argon2';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { lucia } from '$lib/server/auth.js';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	return { user: locals.user };
};

export const actions = {
	updateBio: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');
		
		const formData = await request.formData();
		const bio = formData.get('bio');

		await db.update(users).set({ bio }).where(eq(users.id, locals.user.id));
		return { success: true };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');
		const formData = await request.formData();
		const oldPassword = formData.get('oldPassword');
		const newPassword = formData.get('newPassword');

		if (!oldPassword || !newPassword || newPassword.length < 6) return fail(400, { error: 'Neplatné údaje nebo příliš krátké heslo.' });

		const userRecord = await db.select().from(users).where(eq(users.id, locals.user.id));
		const validPassword = await verify(userRecord[0].passwordHash, oldPassword);
		if (!validPassword) return fail(400, { error: 'Současné heslo je nesprávné.' });

		const passwordHash = await hash(newPassword);
		await db.update(users).set({ passwordHash }).where(eq(users.id, locals.user.id));
		return { success: true };
	},

	deleteAccount: async ({ locals, cookies }) => {
		if (!locals.user) throw redirect(302, '/login');

		// Vymazání z DB (kaskáda smaže sessions, maps i ratings)
		await db.delete(users).where(eq(users.id, locals.user.id));
		
		// Zneplatnění session v prohlížeči
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".", ...sessionCookie.attributes
		});

		throw redirect(302, '/');
	}
};