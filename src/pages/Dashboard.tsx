import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import StatCard from '../components/StatCard'
import TaskItem from '../components/TaskItem'
import { Clock, Plus, X } from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

export default function Dashboard() {
  const stats    = useQuery(api.stats.getDashboardStats)
  const projects = useQuery(api.projects.listProjects)
  const tasks    = useQuery(api.tasks.listTasks, {})
  const checkins = useQuery(api.checkins.listCheckins, { limit: 3 })

  const [showTimeLog, setShowTimeLog] = useState(false)
  const [tlProject, setTlProject] = useState('')
  const [tlMinutes, setTlMinutes] = useState('')
  const [tlNote, setTlNote] = useState('')
  const createTimelog = useMutation(api.timelogs.createTimelog)

  const today = new Date().toISOString().split('T')[0]
  const todaysTasks = (tasks ?? []).filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' &&
      (t.deadline === today || t.status === 'in_progress')
  )
  const activeProjects = (projects ?? []).filter((p) => p.status === 'active')

  const logTime = async () => {
    if (!tlProject || !tlMinutes) return
    await createTimelog({
      projectId: tlProject as Id<'projects'>,
      date: today,
      minutes: parseInt(tlMinutes),
      note: tlNote || undefined,
    })
    setShowTimeLog(false)
    setTlProject('')
    setTlMinutes('')
    setTlNote('')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={() => setShowTimeLog(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Clock size={16} />
          Log Time
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed this week" value={stats?.completedThisWeek ?? '—'} color="green" />
        <StatCard label="Completion rate" value={stats ? `${stats.completionRate}%` : '—'} color="indigo" />
        <StatCard label="Hours logged" value={stats ? `${Math.round((stats.totalMinutesLogged ?? 0) / 60)}h` : '—'} color="indigo" />
        <StatCard label="Overdue tasks" value={stats?.overdueCount ?? '—'} color={stats?.overdueCount ? 'red' : 'green'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Active Projects</h3>
          {!projects && <p className="text-gray-400 text-sm">Loading...</p>}
          <div className="space-y-3">
            {activeProjects.map((p) => (
              <div key={p._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="text-gray-500">{p.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
                {p.deadline && <p className="text-xs text-gray-400 mt-1">Due {p.deadline}</p>}
              </div>
            ))}
            {activeProjects.length === 0 && <p className="text-gray-400 text-sm">No active projects</p>}
          </div>
        </div>

        {/* Recent check-ins */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Check-ins</h3>
          {!checkins && <p className="text-gray-400 text-sm">Loading...</p>}
          <div className="space-y-3">
            {(checkins ?? []).map((c) => (
              <div key={c._id} className="border-l-2 border-indigo-200 pl-3">
                <p className="text-xs font-medium text-gray-700">{c.date}</p>
                <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                  {c.energyLevel && <span>Energy {c.energyLevel}/5</span>}
                  {c.focusScore && <span>Focus {c.focusScore}/5</span>}
                </div>
                {c.wins && <p className="text-xs text-gray-500 mt-1 truncate">{c.wins}</p>}
              </div>
            ))}
            {(checkins ?? []).length === 0 && <p className="text-gray-400 text-sm">No check-ins yet</p>}
          </div>
        </div>
      </div>

      {/* Today's tasks */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Tasks</h3>
        {!tasks && <p className="text-gray-400 text-sm">Loading...</p>}
        <div className="space-y-2">
          {todaysTasks.map((t) => {
            const proj = projects?.find((p) => p._id === t.projectId)
            return <TaskItem key={t._id} task={t} projectName={proj?.name} />
          })}
          {todaysTasks.length === 0 && tasks && <p className="text-gray-400 text-sm">No tasks for today</p>}
        </div>
      </div>

      {/* Log time modal */}
      {showTimeLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Log Time</h3>
              <button onClick={() => setShowTimeLog(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              <select
                value={tlProject}
                onChange={(e) => setTlProject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="">Select project...</option>
                {(projects ?? []).map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={tlMinutes}
                onChange={(e) => setTlMinutes(e.target.value)}
                placeholder="Minutes"
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                value={tlNote}
                onChange={(e) => setTlNote(e.target.value)}
                placeholder="Note (optional)"
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                onClick={logTime}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
