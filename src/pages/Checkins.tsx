import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import CheckinForm from '../components/CheckinForm'
import { Plus, X, Zap, Brain } from 'lucide-react'

export default function Checkins() {
  const checkins = useQuery(api.checkins.listCheckins, { limit: 30 }) ?? []
  const [showForm, setShowForm] = useState(false)

  // Heatmap: last 12 weeks
  const today = new Date()
  const heatmapDays: { date: string; hasCheckin: boolean }[] = []
  const checkinDates = new Set(checkins.map((c) => c.date))
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    heatmapDays.push({ date: dateStr, hasCheckin: checkinDates.has(dateStr) })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Check-ins</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Log Today
        </button>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Last 12 weeks</p>
        <div className="flex flex-wrap gap-1">
          {heatmapDays.map((d) => (
            <div
              key={d.date}
              title={d.date}
              className={`w-4 h-4 rounded-sm ${d.hasCheckin ? 'bg-indigo-500' : 'bg-gray-100'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" /> No check-in
          <div className="w-3 h-3 bg-indigo-500 rounded-sm ml-2" /> Checked in
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {checkins.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">{c.date}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {c.energyLevel && (
                  <span className="flex items-center gap-1">
                    <Zap size={14} className="text-yellow-500" />
                    {c.energyLevel}/5
                  </span>
                )}
                {c.focusScore && (
                  <span className="flex items-center gap-1">
                    <Brain size={14} className="text-indigo-500" />
                    {c.focusScore}/5
                  </span>
                )}
              </div>
            </div>
            {c.wins && (
              <div className="mb-2">
                <p className="text-xs font-medium text-green-700 mb-0.5">Wins</p>
                <p className="text-sm text-gray-700">{c.wins}</p>
              </div>
            )}
            {c.blockers && (
              <div className="mb-2">
                <p className="text-xs font-medium text-red-600 mb-0.5">Blockers</p>
                <p className="text-sm text-gray-700">{c.blockers}</p>
              </div>
            )}
            {c.notes && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-0.5">Notes</p>
                <p className="text-sm text-gray-700">{c.notes}</p>
              </div>
            )}
            {c.completedTaskIds.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">{c.completedTaskIds.length} task(s) completed</p>
            )}
          </div>
        ))}
        {checkins.length === 0 && <p className="text-gray-400 text-sm">No check-ins yet. Start by logging today!</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Check-in</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <CheckinForm onDone={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
