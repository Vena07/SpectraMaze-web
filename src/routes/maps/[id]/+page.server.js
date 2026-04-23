import { db } from '$lib/server/db/index.js';
import { maps, users, ratings } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const mapRes = await db.select({
		id: maps.id,
		title: maps.title,
		createdAt: maps.createdAt,
		author: users.username
	}).from(maps).leftJoin(users, eq(maps.userId, users.id)).where(eq(maps.id, params.id));

	if (!mapRes.length) throw error(404, 'Mapa nenalezena');

	const mapRatings = await db.select().from(ratings).where(eq(ratings.mapId, params.id));
	const avgRating = mapRatings.length ? (mapRatings.reduce((a, b) => a + b.stars, 0) / mapRatings.length).toFixed(1) : 'Nehodnoceno';

	let userRating = null;
	if (locals.user) {
		const userR = mapRatings.find(r => r.userId === locals.user.id);
		if (userR) userRating = userR.stars;
	}

	return { map: mapRes[0], avgRating, userRating };
};

export const actions = {
	rate: async ({ request, params, locals }) => {
		if (!locals.user) return fail(401, { error: 'Musíte být přihlášeni pro hodnocení.' });
		const formData = await request.formData();
		const stars = parseInt(formData.get('stars'));
		if (stars < 1 || stars > 5) return fail(400, { error: 'Neplatné hodnocení.' });

		const existing = await db.select().from(ratings).where(and(eq(ratings.mapId, params.id), eq(ratings.userId, locals.user.id)));
		
		if (existing.length) await db.update(ratings).set({ stars }).where(eq(ratings.id, existing[0].id));
		else await db.insert(ratings).values({ mapId: params.id, userId: locals.user.id, stars });
		
		return { success: true };
	}
};