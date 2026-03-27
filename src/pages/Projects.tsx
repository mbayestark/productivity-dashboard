import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ProjectCard from '../components/ProjectCard'
import TaskItem from '../components/TaskItem'
import ProjectNotes from '../components/ProjectNotes'
import { Plus, X } from 'lucide-react'

const ROLES = ['IT Committee', 'Student Gov', 'JDAS', 'AASTIC', 'Personal', 'Academic', 'Career']
const COLORS = ['blue', 'orange', 'teal', 'purple', 'gray', 'green', 'pink']

export default function Projects() {
  const projects      = useQuery(api.projects.listProjects) ?? []
  const tasks         = useQuery(api.tasks.listTasks, {}) ?? []
  const createProject = useMutation(api.projects.createProject)

  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', role: 'Personal', status: 'active', progress: 0,
    priority: 'medium', color: 'gray', deadline: '', description: '',
  })

  const submit = async () => {
    if (!form.name) return
    await createProject({
      name: form.name,
      role: form.role,
      status: form.status,
      progress: form.progress,
      priority: form.priority,
      color: form.color,
      deadline: form.deadline || undefined,
      description: form.description || undefined,
    })
    setShowForm(false)
    setForm({ name: '', role: 'Personal', status: 'active', progress: 0, priority: 'medium', color: 'gray', deadline: '', description: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p._id}>
            <ProjectCard
              project={p}
              onClick={() => setExpanded(expanded === p._id ? null : p._id)}
            />
            {expanded === p._id && (
              <div className="mt-2 bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasks</p>
                  {tasks.filter((t) => t.projectId === p._id).map((t) => (
                    <TaskItem key={t._id} task={t} />
                  ))}
                  {tasks.filter((t) => t.projectId === p._id).length === 0 && (
                    <p className="text-sm text-gray-400">No tasks yet</p>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <ProjectNotes projectId={p._id} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">New Project</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="space-y-3">
              {([['Name', 'name', 'text'], ['Deadline', 'deadline', 'date'], ['Description', 'description', 'text']] as const).map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-600">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['Role', 'role', ROLES],
                  ['Priority', 'priority', ['high','medium','low']],
                  ['Status', 'status', ['active','paused','completed','blocked']],
                  ['Color', 'color', COLORS],
                ] as const).map(([label, key, opts]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-600">{label}</label>
                    <select value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                      {(opts as readonly string[]).map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Progress ({form.progress}%)</label>
                <input type="range" min={0} max={100} value={form.progress}
                  onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                  className="w-full mt-1" />
              </div>
              <button onClick={submit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
