export interface Note {
	id: number
	title: string
	content: string
	createdAt: Date
	updatedAt: Date
}

export type NoteCreate = Pick<Note, "title" | "content"> & {
	title?: string
}

export type NoteUpdate = NoteCreate & {
	id: number
}
