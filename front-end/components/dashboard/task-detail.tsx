"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { XIcon, PlusIcon, CheckIcon, TagIcon, TrashIcon } from "lucide-react"
import { useTasks } from "@/context/task-context"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskDetailProps {
  taskId: string
  onClose: () => void
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"none" | "low" | "medium" | "high">("none")
  const [dueDate, setDueDate] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [isAddingLabel, setIsAddingLabel] = useState(false)
  const { tasks, folders, updateTask, deleteTask } = useTasks()

  // Load task data
  useEffect(() => {
    const foundTask = tasks.find((t) => t._id === taskId)
    if (foundTask) {
      setTask(foundTask)
      setTitle(foundTask.title)
      setDescription(foundTask.description || "")
      setPriority(foundTask.priority)
      setDueDate(foundTask.dueDate ? new Date(foundTask.dueDate).toISOString().split("T")[0] : "")
    }
  }, [taskId, tasks])

  if (!task) return null

  const handleSave = async () => {
    try {
      await updateTask(taskId, {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      })
      toast.success("Task updated successfully")
    } catch (error) {
      console.error("Failed to update task", error)
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(taskId)
      toast.success("Task deleted successfully")
      onClose()
    } catch (error) {
      console.error("Failed to delete task", error)
      toast.error("Failed to delete task")
    }
  }

  const handleAddLabel = async () => {
    if (!newLabel.trim()) return

    try {
      const currentLabels = task.labels || []
      if (currentLabels.includes(newLabel.trim())) {
        toast.error("Label already exists")
        return
      }

      await updateTask(taskId, {
        labels: [...currentLabels, newLabel.trim()],
      })
      setNewLabel("")
      setIsAddingLabel(false)
      toast.success("Label added successfully")
    } catch (error) {
      console.error("Failed to add label", error)
      toast.error("Failed to add label")
    }
  }

  const handleRemoveLabel = async (label: string) => {
    try {
      const currentLabels = task.labels || []
      await updateTask(taskId, {
        labels: currentLabels.filter((l) => l !== label),
      })
      toast.success("Label removed successfully")
    } catch (error) {
      console.error("Failed to remove label", error)
      toast.error("Failed to remove label")
    }
  }

  const handleToggleComplete = async () => {
    try {
      await updateTask(taskId, { completed: !task.completed })
    } catch (error) {
      console.error("Failed to update task", error)
      toast.error("Failed to update task")
    }
  }

  // Find the current folder
  const currentFolder = folders.find((f) => f.id === task.folderId)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleComplete}
              className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-violet-600 dark:bg-violet-700 border-violet-600 dark:border-violet-700"
                  : "border-gray-300 dark:border-gray-600 hover:border-violet-500 dark:hover:border-violet-500"
              }`}
            >
              {task.completed && <CheckIcon className="h-4 w-4 text-white" />}
            </button>
            <h2 className="text-lg font-medium">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as "none" | "low" | "medium" | "high")
                  handleSave()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900 transition-colors"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  handleSave()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Labels</label>
              {!isAddingLabel && (
                <button
                  onClick={() => setIsAddingLabel(true)}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add Label
                </button>
              )}
            </div>

            {isAddingLabel && (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Enter label name"
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                />
                <button
                  onClick={handleAddLabel}
                  className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingLabel(false)
                    setNewLabel("")
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {task.labels && task.labels.length > 0 ? (
                task.labels.map((label) => (
                  <div
                    key={label}
                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full group hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <TagIcon className="h-3 w-3" />
                    <span>{label}</span>
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No labels added yet</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder</label>
            <div className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", currentFolder?.color || "bg-gray-400")}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{currentFolder?.name || "Unknown"}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              Delete Task
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
