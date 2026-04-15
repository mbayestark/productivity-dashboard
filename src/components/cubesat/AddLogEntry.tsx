import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Plus } from 'lucide-react'

const typeOptions = ['firmware', 'hardware', 'test', 'milestone', 'issue']
const subsystemOptions = ['OBC', 'EPS', 'ADCS', 'COMM', 'CAM', 'Structure']

export default function AddLogEntry() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [type, setType] = useState('firmware')
  const [subsystem, setSubsystem] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const addEntry = useMutation(api.cubesat.addLogEntry)

  const submit = async () => {
    if (!title.trim()) return
    await addEntry({
      date,
      type,
      subsystem: subsystem || undefined,
      title: title.trim(),
      body: body.trim() || undefined,
    })
    setTitle('')
    setBody('')
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Add Entry</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={type} onChange={(e) => setType(e.target.value)}
          className="border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={subsystem} onChange={(e) => setSubsystem(e.target.value)}
          className="border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Subsystem (optional)</option>
          {subsystemOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>
      <div className="flex gap-2">
        <textarea
          value={body} onChange={(e) => setBody(e.target.value)}
          placeholder="Body (optional)"
          rows={1}
          className="flex-1 border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
        <button
          onClick={submit}
          disabled={!title.trim()}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  )
}
