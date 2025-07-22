import type { Note } from "../types/note"

export const sortNotesByUpdatedAt = (notes: Note[]) =>
	notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
