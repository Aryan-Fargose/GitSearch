import { Link } from 'react-router-dom'

export default function UserCard({ user }) {
  return (
    <Link
      to={`/user/${user.login}`}
      className="flex items-center gap-3 border border-gray-200 dark:border-purple-800 rounded-lg p-4
                 bg-white dark:bg-purple-950/30
                 hover:shadow-md dark:hover:shadow-purple-900/50 transition-shadow"
    >
      <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full" />
      <div className="min-w-0">
        <p className="font-semibold text-blue-700 dark:text-purple-300 truncate">{user.login}</p>
        <p className="text-sm text-gray-500 dark:text-purple-400 capitalize">{user.type}</p>
      </div>
    </Link>
  )
}