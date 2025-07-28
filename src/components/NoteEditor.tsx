import { useState } from "react"
import type { Note } from "../types/note"

interface NoteEditorProps {
	note?: Note | null
	onSave: (noteData: { id?: number; title: string; content: string }) => void
	onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
	const [title, setTitle] = useState(note?.title || "")
	const [content, setContent] = useState(note?.content || "")
	const [isSaving, setIsSaving] = useState(false)

	const isEditing = Boolean(note?.id)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!title.trim() && !content.trim()) {
			alert("Please add a title or content")
			return
		}

		setIsSaving(true)
		try {
			await onSave({
				...(note?.id && { id: note.id }),
				title: title.trim() || "Untitled",
				content: content.trim()
			})

			// Only reset form if creating a new note
			if (!isEditing) {
				setTitle("")
				setContent("")
			}
		} catch (error) {
			console.error("Failed to save note:", error)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-900">
					{isEditing ? "Edit Note" : "Create New Note"}
				</h2>
				<button
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600 transition-colors p-2"
					aria-label="Cancel"
				>
					<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
						Title
					</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder="Enter note title..."
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Content
					</label>
					<textarea
						id="content"
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder="Write your note here..."
						rows={10}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
					/>
				</div>

				<div className="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSaving}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSaving ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
					</button>
				</div>
			</form>
		</div>
	)
}
