import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Send, Trash2 } from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

export default function Notes() {
  const projects = useQuery(api.projects.listProjects) ?? []
  const allNotes = useQuery(api.projectNotes.listAll) ?? []
  const addNote = useMutation(api.projectNotes.addNote)
  const deleteNote = useMutation(api.projectNotes.deleteNote)

  const [selectedProject, setSelectedProject] = useState<Id<'projects'> | 'all'>('all')
  const [text, setText] = useState('')
  const [addingTo, setAddingTo] = useState<Id<'projects'> | ''>('')

  const projectMap = Object.fromEntries(projects.map((p) => [p._id, p]))

  const filtered =
    selectedProject === 'all'
      ? allNotes
      : allNotes.filter((n) => n.projectId === selectedProject)

  // Group notes by date
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, note) => {
    const key = note.date
    if (!acc[key]) acc[key] = []
    acc[key].push(note)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed || !addingTo) return
    await addNote({ projectId: addingTo as Id<'projects'>, content: trimmed })
    setText('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = today.getTime() - d.getTime()
    const days = Math.round(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value as Id<'projects'> | 'all')}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Add note */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New note</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={addingTo}
            onChange={(e) => setAddingTo(e.target.value as Id<'projects'> | '')}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:w-48"
          >
            <option value="">Select project…</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <div className="flex flex-1 items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Write a note… (Enter to save)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={submit}
              disabled={!text.trim() || !addingTo}
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Notes feed grouped by date */}
      {sortedDates.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No notes yet — add one above.</p>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0 bg-gray-50 py-1">
            {formatDate(date)}
          </p>
          <div className="space-y-2">
            {grouped[date].map((note) => {
              const project = projectMap[note.projectId]
              return (
                <div
                  key={note._id}
                  className="group bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colorMap[project?.color ?? 'gray'] ?? 'bg-gray-500'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-500">
                        {project?.name ?? 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{formatTime(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-snug">{note.content}</p>
                  </div>
                  <button
                    onClick={() => deleteNote({ id: note._id })}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 shrink-0 mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
