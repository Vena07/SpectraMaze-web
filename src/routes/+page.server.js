import { db } from '$lib/server/db/index.js';
import { maps, users } from '$lib/server/db/schema.js';
import { eq, like, or } from 'drizzle-orm';

export const load = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	
	let mapsQuery = db.select({
		id: maps.id,
		title: maps.title,
		author: users.username,
		createdAt: maps.createdAt
	}).from(maps).leftJoin(users, eq(maps.userId, users.id));

	if (query) {
		mapsQuery = mapsQuery.where(or(
			like(maps.title, `%${query}%`),
			eq(maps.id, query)
		));
	}

	const allMaps = await mapsQuery;
	return { maps: allMaps, query };
};