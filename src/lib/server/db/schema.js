import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	bio: text('bio').default(''),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
});

export const maps = sqliteTable('maps', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	levelData: text('level_data').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const ratings = sqliteTable('ratings', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	mapId: text('map_id').notNull().references(() => maps.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	stars: integer('stars').notNull()
});

export const leaderboards = sqliteTable('leaderboards', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	score: integer('score').notNull().default(0)
});
