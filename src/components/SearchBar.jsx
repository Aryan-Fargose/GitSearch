export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search GitHub repositories..."
      className="w-full max-w-2xl mx-auto block px-4 py-3 rounded-lg border border-gray-300 dark:border-purple-800
                 bg-white dark:bg-purple-950/40 text-gray-900 dark:text-purple-100
                 dark:placeholder-purple-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 text-base"
    />
  )
}