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

export async function getAllNotes(): Promise<Note[]> {
	const db = await initDB()
	return db.getAll("notes")
}

export async function getNoteById(id: number): Promise<Note | undefined> {
	const db = await initDB()
	return db.get("notes", id)
}

export async function createNote(note: Omit<Note, "id">): Promise<number> {
	const db = await initDB()
	return db.add("notes", note as Note)
}

export async function updateNote(id: number, note: Partial<Note>): Promise<void> {
	const db = await initDB()
	const existingNote = await db.get("notes", id)
	if (!existingNote) {
		throw new Error(`Note with id ${id} does not exist`)
	}

	const updatedNote = { ...existingNote, ...note }
	await db.put("notes", updatedNote)
}

export async function deleteNote(id: number): Promise<void> {
	const db = await initDB()
	await db.delete("notes", id)
}

export async function searchNotes(query: string): Promise<Note[]> {
	const db = await initDB()
	const allNotes = await db.getAll("notes")
	return allNotes.filter(note => note.title.includes(query) || note.content.includes(query))
}
