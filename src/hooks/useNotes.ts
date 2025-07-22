import { useCallback, useState } from "react"
import { createNote, getAllNotes, updateNote } from "../db/db"
import type { Note, NoteCreate, NoteUpdate } from "../types/note"

export function useNotes() {
	const [notes, setNotes] = useState<Note[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadNotes = useCallback(async () => {
		try {
			setLoading(true)
			const allNotes = await getAllNotes()
			setNotes(
				allNotes.sort(
					(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				)
			)
			setError(null)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load notes")
		} finally {
			setLoading(false)
		}
	}, [])

	const addNote = useCallback(async (noteData: NoteCreate) => {
		try {
			const now = new Date()
			const newNote: Omit<Note, "id"> = {
				title: noteData.title || "Untitled",
				content: noteData.content,
				createdAt: now,
				updatedAt: now
			}
			const id = await createNote(newNote)
			const createdNote: Note = { ...newNote, id }
			setNotes(prev => [createdNote, ...prev])
			return createdNote
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create note")
			throw err
		}
	}, [])

	const editNote = useCallback(async (noteUpdate: NoteUpdate) => {
		try {
			const updatedData = { ...noteUpdate, updatedAt: new Date() }
			await updateNote(noteUpdate.id, updatedData)
			setNotes(prev =>
				prev
					.map(note => (note.id === noteUpdate.id ? { ...note, ...updatedData } : note))
					.sort(
						(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					)
			)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update note")
			throw err
		}
	}, [])

	return {
		notes,
		loading,
		error,
		addNote,
		editNote,
		refresh: loadNotes
	}
}
