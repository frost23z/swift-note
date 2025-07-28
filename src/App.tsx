import { useState } from "react"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { NoteCard } from "./components/NoteCard"
import { NoteEditor } from "./components/NoteEditor"
import { useNotes } from "./hooks/useNotes"
import type { Note } from "./types/note"

function App() {
	const { notes, loading, error, addNote, removeNote, editNote } = useNotes()
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [showEditor, setShowEditor] = useState(false)

	const handleCreateNote = () => {
		setSelectedNote(null)
		setShowEditor(true)
	}

	const handleEditNote = (note: Note) => {
		setSelectedNote(note)
		setShowEditor(true)
	}

	const handleSaveNote = async (noteData: { id?: number; title: string; content: string }) => {
		try {
			if (noteData.id) {
				// Editing existing note
				await editNote(noteData as any)
				setSelectedNote(null)
			} else {
				// Creating new note
				await addNote(noteData)
			}
			setShowEditor(false)
		} catch (error) {
			console.error("Failed to save note:", error)
		}
	}

	const handleCancelEditor = () => {
		setSelectedNote(null)
		setShowEditor(false)
	}

	const handleDeleteNote = async (id: number) => {
		try {
			await removeNote(id)
		} catch (error) {
			console.error("Failed to delete note:", error)
		}
	}

	if (loading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	return (
		<main className="h-screen p-8 bg-gray-100">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
					<button
						onClick={handleCreateNote}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create New Note
					</button>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						Error: {error}
					</div>
				)}

				{showEditor && (
					<div className="mb-8">
						<NoteEditor
							note={selectedNote}
							onSave={handleSaveNote}
							onCancel={handleCancelEditor}
						/>
					</div>
				)}

				{notes.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No notes yet. Create your first note!
						</p>
					</div>
				) : (
					<div className="grid gap-4">
						{notes.map(note => (
							<NoteCard
								key={note.id}
								note={note}
								onDelete={handleDeleteNote}
								onEdit={handleEditNote}
							/>
						))}
					</div>
				)}
			</div>
		</main>
	)
}

export default App
