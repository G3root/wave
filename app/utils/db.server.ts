import { remember } from '@epic-web/remember'
import SQLite from 'better-sqlite3'
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely'
import { type DB } from '~/types/db'

const dialect = new SqliteDialect({
	database: new SQLite('data.db'),
})

export const db = remember(
	'kysely',
	() =>
		new Kysely<DB>({
			dialect,
			plugins: [new CamelCasePlugin()],
		}),
)

export type KyselyDb = typeof db
