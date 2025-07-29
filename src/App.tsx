import { useState } from "react"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { NoteEditor } from "./components/NoteEditor"
import { Sidebar } from "./components/Sidebar"
import { useNotes } from "./hooks/useNotes"
import type { Note } from "./types/note"

function App() {
	const { notes, loading, error, addNote, removeNote, editNote, searchNotes } = useNotes()
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [showEditor, setShowEditor] = useState(false)

	const handleCreateNote = () => {
		setSelectedNote(null)
		setShowEditor(true)
	}

	const handleSelectNote = (note: Note) => {
		setSelectedNote(note)
		setShowEditor(false)
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
				setSelectedNote(prev =>
					prev
						? {
								...prev,
								title: noteData.title,
								content: noteData.content,
								updatedAt: new Date()
							}
						: null
				)
			} else {
				// Creating new note
				const newNote = await addNote(noteData)
				setSelectedNote(newNote)
			}
			setShowEditor(false)
		} catch (error) {
			console.error("Failed to save note:", error)
		}
	}

	const handleCancelEditor = () => {
		setShowEditor(false)
	}

	const handleDeleteNote = async (id: number) => {
		try {
			await removeNote(id)
			// If we deleted the currently selected note, clear selection
			if (selectedNote?.id === id) {
				setSelectedNote(null)
				setShowEditor(false)
			}
		} catch (error) {
			console.error("Failed to delete note:", error)
		}
	}

	const handleSearch = (query: string) => {
		searchNotes(query)
	}

	if (loading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	return (
		<div className="h-screen flex bg-gray-100">
			{/* Sidebar */}
			<div className="w-80 flex-shrink-0">
				<Sidebar
					notes={notes}
					selectedNoteId={selectedNote?.id || null}
					onNoteSelect={handleSelectNote}
					onNoteDelete={handleDeleteNote}
					onSearch={handleSearch}
					onNewNote={handleCreateNote}
					loading={loading}
					className="h-full"
				/>
			</div>

			{/* Main content area */}
			<div className="flex-1 flex flex-col">
				{error && (
					<div className="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						Error: {error}
					</div>
				)}

				{showEditor ? (
					<div className="flex-1 p-6">
						<NoteEditor
							note={selectedNote}
							onSave={handleSaveNote}
							onCancel={handleCancelEditor}
						/>
					</div>
				) : selectedNote ? (
					<div className="flex-1 p-6">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
							<div className="flex justify-between items-start p-6 border-b border-gray-200">
								<h1 className="text-2xl font-bold text-gray-900 flex-1 pr-4">
									{selectedNote.title || "Untitled"}
								</h1>
								<button
									onClick={() => handleEditNote(selectedNote)}
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
							</div>
							<div className="p-6">
								<div className="text-sm text-gray-500 mb-4">
									Created: {new Date(selectedNote.createdAt).toLocaleDateString()}{" "}
									• Updated:{" "}
									{new Date(selectedNote.updatedAt).toLocaleDateString()}
								</div>
								<div className="prose max-w-none">
									<p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
										{selectedNote.content}
									</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex-1 flex items-center justify-center">
						<div className="text-center">
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
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No note selected
							</h3>
							<p className="text-gray-500 mb-4">
								Select a note from the sidebar or create a new one
							</p>
							<button
								onClick={handleCreateNote}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Create New Note
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default App
