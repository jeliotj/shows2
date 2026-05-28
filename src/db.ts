import Database, { Database as DatabaseType } from 'better-sqlite3'

const db: DatabaseType = new Database(process.env.DB_PATH ?? './shows.db')
db.pragma('journal_mode = WAL')

export default db
