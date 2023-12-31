import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { type DB } from '~/types/db' // this is the Database interface we defined earlier

const dialect = new SqliteDialect({
	database: new SQLite('data.db'),
})

export const db = new Kysely<DB>({
	dialect,
})
