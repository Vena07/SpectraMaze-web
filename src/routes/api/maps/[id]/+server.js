import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { maps } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const GET = async ({ params }) => {
	const mapId = params.id;
	const result = await db.select().from(maps).where(eq(maps.id, mapId));
	
	if (result.length === 0) {
		return new Response('Mapa nenalezena', { status: 404 });
	}
	
	const map = result[0];
	return json({
		id: map.id,
		title: map.title,
		author_id: map.userId,
		level_data: JSON.parse(map.levelData)
	});
};