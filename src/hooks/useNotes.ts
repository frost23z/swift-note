import { useCallback, useEffect, useState } from "react"
import { createNote, deleteNote, getAllNotes, updateNote } from "../db/db"
import type { Note, NoteCreate, NoteUpdate } from "../types/note"
import { sortNotesByUpdatedAt } from "../utils/sort"

export function useNotes() {
	const [notes, setNotes] = useState<Note[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadNotes = useCallback(async () => {
		try {
			setLoading(true)
			const allNotes = await getAllNotes()
			setNotes(sortNotesByUpdatedAt(allNotes))
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
				sortNotesByUpdatedAt(
					prev.map(note =>
						note.id === noteUpdate.id ? { ...note, ...updatedData } : note
					)
				)
			)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update note")
			throw err
		}
	}, [])

	const removeNote = useCallback(async (id: number) => {
		try {
			await deleteNote(id)
			setNotes(prev => prev.filter(note => note.id !== id))
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete note")
			throw err
		}
	}, [])

	useEffect(() => {
		loadNotes()
	}, [loadNotes])

	return {
		notes,
		loading,
		error,
		addNote,
		editNote,
		removeNote,
		refresh: loadNotes
	}
}
