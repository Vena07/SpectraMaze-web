import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { leaderboards, users } from '$lib/server/db/schema.js';
import { eq, asc } from 'drizzle-orm';

// Získání TOP 10 nejrychlejších časů pro mapu
export const GET = async ({ params }) => {
	const times = await db.select({
		id: leaderboards.id,
		timeMs: leaderboards.timeMs,
		player: users.username,
		createdAt: leaderboards.createdAt
	})
	.from(leaderboards)
	.leftJoin(users, eq(leaderboards.userId, users.id))
	.where(eq(leaderboards.mapId, params.id))
	.orderBy(asc(leaderboards.timeMs)) // Od nejmenšího čísla (nejrychlejší)
	.limit(10);

	return json(times);
};

// Odeslání nového času z Pythonu
export const POST = async ({ params, request }) => {
	const body = await request.json();
	
	if (!body.user_id || !body.time_ms) return new Response('Chybí data', { status: 400 });

	await db.insert(leaderboards).values({ mapId: params.id, userId: body.user_id, timeMs: body.time_ms });
	
	return json({ success: true });
};