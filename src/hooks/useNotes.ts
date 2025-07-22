import { useCallback, useState } from "react"
import { getAllNotes } from "../db/db"
import type { Note } from "../types/note"

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

	return {
		notes,
		loading,
		error,
		refetch: loadNotes
	}
}
