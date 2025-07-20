import { type DBSchema, type IDBPDatabase, openDB } from "idb"
import type { Note } from "../types/note"

interface NotesDB extends DBSchema {
	notes: {
		key: number
		value: Note
		indexes: {
			"by-title": string
			"by-created": Date
			"by-updated": Date
		}
	}
}

const DB_NAME = "SwiftNoteDB"
const DB_VERSION = 1

let db: IDBPDatabase<NotesDB> | null = null

async function initDB(): Promise<IDBPDatabase<NotesDB>> {
	if (db) return db
	db = await openDB<NotesDB>(DB_NAME, DB_VERSION, {
		upgrade(db) {
			const store = db.createObjectStore("notes", {
				keyPath: "id",
				autoIncrement: true
			})

			store.createIndex("by-title", "title")
			store.createIndex("by-created", "createdAt")
			store.createIndex("by-updated", "updatedAt")
		}
	})
	return db
}
