import { useState } from "react"

interface SearchBarProps {
	onSearch: (query: string) => void
	placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search notes..." }: SearchBarProps) {
	const [query, setQuery] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSearch(query)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value
		setQuery(newQuery)
		// Real-time search as user types
		onSearch(newQuery)
	}

	const handleClear = () => {
		setQuery("")
		onSearch("")
	}

	return (
		<form onSubmit={handleSubmit} className="relative">
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<svg
						className="h-4 w-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<input
					type="text"
					value={query}
					onChange={handleChange}
					placeholder={placeholder}
					className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
				/>
				{query && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>
		</form>
	)
}
