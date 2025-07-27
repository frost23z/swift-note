import { LoadingSpinner } from "./components/LoadingSpinner"
import { NoteCard } from "./components/NoteCard"
import { useNotes } from "./hooks/useNotes"

function App() {
	const { notes, loading, error, addNote, removeNote } = useNotes()

	const handleCreateNote = async () => {
		try {
			await addNote({
				title: "Sample Note",
				content: "This is a sample note created at " + new Date().toLocaleTimeString()
			})
		} catch (error) {
			console.error("Failed to create note:", error)
		}
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
						Add Sample Note
					</button>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						Error: {error}
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
							/>
						))}
					</div>
				)}
			</div>
		</main>
	)
}

export default App
