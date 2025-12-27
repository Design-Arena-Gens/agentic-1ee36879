'use client'

import { useState } from 'react'
import { Play, Trash2, Plus, Clock, CheckCircle, XCircle, Zap } from 'lucide-react'

interface Task {
  id: string
  name: string
  description: string
  schedule: string
  status: 'idle' | 'running' | 'completed' | 'failed'
  lastRun?: Date
  runCount: number
}

interface TaskLog {
  id: string
  taskId: string
  timestamp: Date
  status: 'success' | 'error'
  message: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Data Backup',
      description: 'Automatically backup user data every hour',
      schedule: 'Every hour',
      status: 'idle',
      runCount: 0
    },
    {
      id: '2',
      name: 'Email Report',
      description: 'Send daily performance reports',
      schedule: 'Daily at 9 AM',
      status: 'idle',
      runCount: 0
    },
    {
      id: '3',
      name: 'Database Cleanup',
      description: 'Remove old records and optimize tables',
      schedule: 'Weekly',
      status: 'idle',
      runCount: 0
    }
  ])

  const [logs, setLogs] = useState<TaskLog[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    schedule: ''
  })

  const runTask = async (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: 'running' as const } : t
    ))

    // Simulate task execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.2
    const task = tasks.find(t => t.id === taskId)

    setTasks(tasks.map(t =>
      t.id === taskId
        ? {
            ...t,
            status: success ? 'completed' : 'failed',
            lastRun: new Date(),
            runCount: t.runCount + 1
          }
        : t
    ))

    const newLog: TaskLog = {
      id: Date.now().toString(),
      taskId,
      timestamp: new Date(),
      status: success ? 'success' : 'error',
      message: success
        ? `${task?.name} completed successfully`
        : `${task?.name} failed with error`
    }

    setLogs([newLog, ...logs].slice(0, 50))

    // Reset status after 3 seconds
    setTimeout(() => {
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: 'idle' as const } : t
      ))
    }, 3000)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
    setLogs(logs.filter(l => l.taskId !== taskId))
  }

  const addTask = () => {
    if (!newTask.name || !newTask.description || !newTask.schedule) return

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      description: newTask.description,
      schedule: newTask.schedule,
      status: 'idle',
      runCount: 0
    }

    setTasks([...tasks, task])
    setNewTask({ name: '', description: '', schedule: '' })
    setShowAddTask(false)
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Zap className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">Task Automation Agent</h1>
          </div>
          <p className="text-xl text-gray-600">Automate repetitive tasks and boost your productivity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <Zap className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Running</p>
                <p className="text-3xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'running').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {tasks.reduce((acc, t) => acc + t.runCount, 0)}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {logs.filter(l => l.status === 'error').length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Automated Tasks</h2>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </button>
            </div>

            {showAddTask && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
                <input
                  type="text"
                  placeholder="Task Name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Schedule (e.g., Every hour, Daily)"
                  value={newTask.schedule}
                  onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={addTask}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Schedule: {task.schedule}</p>
                      {task.lastRun && (
                        <p className="text-xs mt-1">
                          Last run: {task.lastRun.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs mt-1">Runs: {task.runCount}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => runTask(task.id)}
                        disabled={task.status === 'running'}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Log</h2>
            <div className="bg-white rounded-lg shadow-md p-6 max-h-[800px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activity yet. Run a task to see logs.</p>
              ) : (
                <div className="space-y-3">
                  {logs.map(log => (
                    <div
                      key={log.id}
                      className={`p-4 rounded-lg ${
                        log.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {log.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium ${
                            log.status === 'success' ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {log.message}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {log.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
