import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { maps, users } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const GET = async () => {
	// Načte všechny mapy a připojí k nim jméno autora z tabulky users
	const allMaps = await db.select({
		id: maps.id,
		title: maps.title,
		author: users.username,
		createdAt: maps.createdAt
	})
	.from(maps)
	.leftJoin(users, eq(maps.userId, users.id))
	.orderBy(desc(maps.createdAt));

	return json(allMaps);
};