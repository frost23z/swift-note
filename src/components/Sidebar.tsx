import type { Note } from "../types/note"
import { NoteSidebarItem } from "./NoteSidebarItem"
import { SearchBar } from "./SearchBar"

interface SidebarProps {
	notes: Note[]
	selectedNoteId: number | null
	onNoteSelect: (note: Note) => void
	onNoteDelete: (id: number) => void
	onSearch: (query: string) => void
	onNewNote: () => void
	loading?: boolean
	className?: string
}

export function Sidebar({
	notes,
	selectedNoteId,
	onNoteSelect,
	onNoteDelete,
	onSearch,
	onNewNote,
	loading = false,
	className = ""
}: SidebarProps) {
	return (
		<div className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}>
			{/* Header */}
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-xl font-bold text-gray-900">Notes</h1>
					<button
						onClick={onNewNote}
						className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						aria-label="Create new note"
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
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</button>
				</div>

				<SearchBar onSearch={onSearch} />
			</div>

			{/* Notes List */}
			<div className="flex-1 overflow-y-auto">
				{loading ? (
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				) : notes.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
						<svg
							className="mx-auto h-12 w-12 text-gray-400 mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<p className="text-sm">No notes found</p>
						<p className="text-xs text-gray-400 mt-1">
							Create your first note to get started
						</p>
					</div>
				) : (
					<div>
						{notes.map(note => (
							<NoteSidebarItem
								key={note.id}
								note={note}
								isSelected={selectedNoteId === note.id}
								onClick={() => onNoteSelect(note)}
								onDelete={() => onNoteDelete(note.id)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="p-4 border-t border-gray-200 bg-gray-50">
				<p className="text-xs text-gray-500 text-center">
					{notes.length} {notes.length === 1 ? "note" : "notes"}
				</p>
			</div>
		</div>
	)
}
