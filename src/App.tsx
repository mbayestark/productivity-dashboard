import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Goals from './pages/Goals'
import Checkins from './pages/Checkins'
import Stats from './pages/Stats'
import Notes from './pages/Notes'
import CubeSatDashboard from './pages/CubeSatDashboard'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 md:ml-64 min-w-0 flex flex-col">
          {/* Mobile top bar */}
          <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-gray-900 text-sm">Mbaye's Dashboard</span>
          </header>

          <div className="flex-1 p-4 md:p-8 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/checkins" element={<Checkins />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/projects/cubesat" element={<CubeSatDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}
