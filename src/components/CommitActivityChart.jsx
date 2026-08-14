import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function CommitActivityChart({ weeks }) {
  if (!weeks || weeks.length === 0) {
    return <p className="text-gray-500 text-sm">No commit activity data available for this repository.</p>
  }

  const totalCommits = weeks.reduce((sum, w) => sum + w.total, 0)

  if (totalCommits === 0) {
    return <p className="text-gray-500 text-sm">No commits recorded in the last year.</p>
  }

  const data = weeks.map((w) => ({
    week: new Date(w.week * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    commits: w.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" interval={7} tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="commits" fill="#3b82f6" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}