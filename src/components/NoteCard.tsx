import type { Note } from "../types/note"

interface NoteCardProps {
	note: Note
	onDelete: (id: number) => void
	onEdit: (note: Note) => void
}

export function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		})
	}

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this note?")) {
			onDelete(note.id)
		}
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-4">
				<h2 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
					{note.title || "Untitled"}
				</h2>
				<div className="flex gap-2">
					<button
						onClick={() => onEdit(note)}
						className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50"
						aria-label="Edit note"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
					<button
						onClick={handleDelete}
						className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
						aria-label="Delete note"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			<p className="text-gray-600 mb-4 leading-relaxed">{note.content}</p>

			<div className="text-sm text-gray-400 flex items-center gap-4">
				<span>Created: {formatDate(note.createdAt)}</span>
				<span>•</span>
				<span>Updated: {formatDate(note.updatedAt)}</span>
			</div>
		</div>
	)
}
