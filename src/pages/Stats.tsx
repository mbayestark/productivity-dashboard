import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import StatCard from '../components/StatCard'

const PIE_COLORS = ['#6366f1', '#f97316', '#14b8a6', '#a855f7', '#6b7280', '#22c55e', '#ec4899']

export default function Stats() {
  const stats   = useQuery(api.stats.getDashboardStats)
  const weekly  = useQuery(api.stats.getWeeklyCompletions) ?? []
  const energy  = useQuery(api.stats.getEnergyTrend) ?? []

  const roleData = Object.entries(stats?.minutesByRole ?? {}).map(([name, minutes]) => ({
    name,
    value: Math.round((minutes as number) / 60),
  }))

  const overdue = stats?.overdueTasks ?? []

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Stats</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total tasks" value={stats?.totalTasks ?? '—'} />
        <StatCard label="Completed" value={stats?.completedTasks ?? '—'} color="green" />
        <StatCard label="Completion rate" value={stats ? `${stats.completionRate}%` : '—'} color="indigo" />
        <StatCard label="Avg energy" value={stats?.avgEnergyLevel ?? '—'} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly completions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Tasks completed per week</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time by role donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Hours by role</p>
          {roleData.length === 0 ? (
            <p className="text-gray-400 text-sm">No time logged yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {roleData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}h`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Energy + focus trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-gray-700 mb-4">Energy & Focus (last 30 days)</p>
          {energy.length === 0 ? (
            <p className="text-gray-400 text-sm">No check-in data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={energy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#f97316" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="focus" stroke="#6366f1" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top overdue */}
      {overdue.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Top Overdue Tasks</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left pb-2">Task</th>
                <th className="text-left pb-2">Priority</th>
                <th className="text-left pb-2">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((t: any) => (
                <tr key={t._id} className="border-b border-gray-50">
                  <td className="py-2 font-medium text-gray-800">{t.title}</td>
                  <td className="py-2 text-gray-500 capitalize">{t.priority}</td>
                  <td className="py-2 text-red-500">{t.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
