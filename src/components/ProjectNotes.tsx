import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Send, Trash2 } from 'lucide-react'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  projectId: Id<'projects'>
}

export default function ProjectNotes({ projectId }: Props) {
  const notes     = useQuery(api.projectNotes.listByProject, { projectId }) ?? []
  const addNote   = useMutation(api.projectNotes.addNote)
  const deleteNote = useMutation(api.projectNotes.deleteNote)

  const [text, setText] = useState('')

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    await addNote({ projectId, content: trimmed })
    setText('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</p>

      {/* Notes list */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400">No notes yet — write your first update below.</p>
        )}
        {notes.map((n) => (
          <div key={n._id} className="group flex items-start gap-2 text-sm">
            <span className="text-xs text-gray-400 mt-0.5 whitespace-nowrap shrink-0">
              {formatTime(n.createdAt)}
            </span>
            <p className="flex-1 text-gray-700 leading-snug">{n.content}</p>
            <button
              onClick={() => deleteNote({ id: n._id })}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 shrink-0"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add an update… (Enter to save)"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
