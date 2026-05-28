import db from './db.js'
import type { Statement } from 'better-sqlite3'

// DB Setup: Run Once
export const createShowTable: Statement = db.prepare(`CREATE TABLE 
  IF NOT EXISTS
  shows(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  start TEXT,
  duration INTEGER)`)

export const insertShow: Statement = db.prepare(`INSERT INTO 
  shows(
  title,
  start,
  duration) 
  VALUES (?, ?, ?)`)

export const getNextShow: Statement = db.prepare(`SELECT 
  title,
  start,
  duration' 
  FROM shows
  WHERE start > datetime('now')`)
