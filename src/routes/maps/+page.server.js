import { db } from '$lib/server/db/index.js';
import { maps, users } from '$lib/server/db/schema.js';
import { eq, like, or, desc } from 'drizzle-orm';

export const load = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	
	let mapsQuery = db.select({
		id: maps.id,
		title: maps.title,
		author: users.username,
		createdAt: maps.createdAt
	}).from(maps).leftJoin(users, eq(maps.userId, users.id)).orderBy(desc(maps.createdAt));

	if (query) {
		mapsQuery = mapsQuery.where(or(
			like(maps.title, `%${query}%`),
			eq(maps.id, query)
		));
	}

	return { maps: await mapsQuery, query };
};