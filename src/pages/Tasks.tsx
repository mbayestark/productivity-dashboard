import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import TaskItem from '../components/TaskItem'
import { Plus, X, LayoutList, Columns } from 'lucide-react'

const STATUSES = ['todo', 'in_progress', 'done', 'cancelled']
const PRIORITIES = ['urgent', 'high', 'medium', 'low']

export default function Tasks() {
  const projects  = useQuery(api.projects.listProjects) ?? []
  const tasks     = useQuery(api.tasks.listTasks, {}) ?? []
  const createTask = useMutation(api.tasks.createTask)

  const [view, setView]         = useState<'list' | 'kanban'>('list')
  const [filterProject, setFP]  = useState('')
  const [filterPriority, setFPr] = useState('')
  const [filterStatus, setFS]   = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    projectId: '', title: '', description: '',
    status: 'todo', priority: 'medium', deadline: '', estimatedMinutes: '',
  })

  const filtered = tasks.filter((t) => {
    if (filterProject && t.projectId !== filterProject) return false
    if (filterPriority && t.priority !== filterPriority) return false
    if (filterStatus && t.status !== filterStatus) return false
    return true
  })

  const submit = async () => {
    if (!form.projectId || !form.title) return
    await createTask({
      projectId: form.projectId as Id<'projects'>,
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      deadline: form.deadline || undefined,
      estimatedMinutes: form.estimatedMinutes ? parseInt(form.estimatedMinutes) : undefined,
    })
    setShowForm(false)
    setForm({ projectId: '', title: '', description: '', status: 'todo', priority: 'medium', deadline: '', estimatedMinutes: '' })
  }

  const tasksByStatus = (s: string) => filtered.filter((t) => t.status === s)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''}`}><LayoutList size={16} /></button>
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded ${view === 'kanban' ? 'bg-white shadow-sm' : ''}`}><Columns size={16} /></button>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterProject} onChange={(e) => setFP(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All projects</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFPr(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFS(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Views */}
      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          {filtered.length === 0 && <p className="text-gray-400 text-sm">No tasks found</p>}
          {filtered.map((t) => {
            const proj = projects.find((p) => p._id === t.projectId)
            return <TaskItem key={t._id} task={t} projectName={proj?.name} />
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in_progress', 'done'] as const).map((s) => (
            <div key={s} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
                {s.replace('_', ' ')} ({tasksByStatus(s).length})
              </p>
              <div className="space-y-2">
                {tasksByStatus(s).map((t) => {
                  const proj = projects.find((p) => p._id === t.projectId)
                  return <TaskItem key={t._id} task={t} projectName={proj?.name} />
                })}
                {tasksByStatus(s).length === 0 && <p className="text-gray-400 text-sm">Empty</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Task</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Project</label>
                <select value={form.projectId} onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="">Select project...</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Deadline</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Est. minutes</label>
                  <input type="number" value={form.estimatedMinutes} onChange={(e) => setForm((f) => ({ ...f, estimatedMinutes: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <button onClick={submit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
