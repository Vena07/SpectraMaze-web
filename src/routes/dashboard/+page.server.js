import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { maps } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');
	
	const myMaps = await db.select().from(maps).where(eq(maps.userId, locals.user.id)).orderBy(desc(maps.createdAt));
	return { maps: myMaps };
};

export const actions = {
	createMap: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');
		
		const formData = await request.formData();
		const title = formData.get('title');
		const levelData = formData.get('levelData');

		if (!title || !levelData) return fail(400, { error: 'Vyplňte obě pole.' });

		try {
			JSON.parse(levelData); // Kontrola, že se opravdu jedná o validní JSON string z python hry
		} catch (e) {
			return fail(400, { error: 'Level data musí být platný JSON formát!' });
		}

		await db.insert(maps).values({ title, levelData, userId: locals.user.id });
	}
};