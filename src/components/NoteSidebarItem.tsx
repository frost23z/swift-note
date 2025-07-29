import type { Note } from "../types/note"

interface NoteSidebarItemProps {
	note: Note
	isSelected?: boolean
	onClick: () => void
	onDelete: () => void
}

export function NoteSidebarItem({
	note,
	isSelected = false,
	onClick,
	onDelete
}: NoteSidebarItemProps) {
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		})
	}

	const truncateContent = (content: string, maxLength: number = 60) => {
		if (content.length <= maxLength) return content
		return content.substring(0, maxLength) + "..."
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (window.confirm("Are you sure you want to delete this note?")) {
			onDelete()
		}
	}

	return (
		<div
			onClick={onClick}
			className={`
				relative p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 group
				${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
			`}
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="font-medium text-gray-900 truncate pr-2 text-sm">
					{note.title || "Untitled"}
				</h3>
				<button
					onClick={handleDelete}
					className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
					aria-label="Delete note"
				>
					<svg
						className="h-4 w-4"
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

			{note.content && (
				<p className="text-xs text-gray-600 mb-2 leading-relaxed">
					{truncateContent(note.content)}
				</p>
			)}

			<div className="text-xs text-gray-400">{formatDate(note.updatedAt)}</div>
		</div>
	)
}
