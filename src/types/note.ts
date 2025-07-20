export interface Note {
	id: number
	title: string
	content: string
	createdAt: Date
	updatedAt: Date
}

export type NoteCreate = Omit<Note, "id" | "createdAt" | "updatedAt"> & {
	title?: string
}
