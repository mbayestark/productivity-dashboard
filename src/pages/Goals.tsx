import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import GoalBar from '../components/GoalBar'
import { Plus, X } from 'lucide-react'

const CATEGORIES = ['academic', 'career', 'personal', 'health', 'project']

export default function Goals() {
  const goals = useQuery(api.goals.listGoals) ?? []
  const createGoal = useMutation(api.goals.createGoal)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'personal', description: '',
    progress: 0, status: 'active', targetDate: '', milestoneText: '',
  })
  const [milestones, setMilestones] = useState<string[]>([])

  const addMilestone = () => {
    if (!form.milestoneText.trim()) return
    setMilestones((m) => [...m, form.milestoneText.trim()])
    setForm((f) => ({ ...f, milestoneText: '' }))
  }

  const submit = async () => {
    if (!form.title) return
    await createGoal({
      title: form.title,
      category: form.category,
      description: form.description || undefined,
      progress: form.progress,
      status: form.status,
      targetDate: form.targetDate || undefined,
      milestones: milestones.length > 0 ? milestones.map((t) => ({ title: t, done: false })) : undefined,
    })
    setShowForm(false)
    setForm({ title: '', category: 'personal', description: '', progress: 0, status: 'active', targetDate: '', milestoneText: '' })
    setMilestones([])
  }

  const active    = goals.filter((g) => g.status === 'active')
  const completed = goals.filter((g) => g.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active ({active.length})</p>
        {active.map((g) => <GoalBar key={g._id} goal={g} />)}
        {active.length === 0 && <p className="text-gray-400 text-sm">No active goals</p>}
      </div>

      {completed.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed ({completed.length})</p>
          {completed.map((g) => <GoalBar key={g._id} goal={g} />)}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Goal</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Target date</label>
                  <input type="date" value={form.targetDate} onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Progress ({form.progress}%)</label>
                <input type="range" min={0} max={100} value={form.progress}
                  onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                  className="w-full mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2} className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Milestones</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={form.milestoneText}
                    onChange={(e) => setForm((f) => ({ ...f, milestoneText: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                    placeholder="Add milestone..."
                    className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <button onClick={addMilestone} className="px-3 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Add</button>
                </div>
                <div className="mt-2 space-y-1">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded p-1.5">
                      <span>{m}</span>
                      <button onClick={() => setMilestones((ms) => ms.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={submit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
