"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskDetail } from "@/components/dashboard/task-detail"
import { useTasks } from "@/context/task-context"
import type { Folder } from "@/lib/types"

export default function FolderPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [folder, setFolder] = useState<Folder | null>(null)
  const { tasks, folders, isLoading } = useTasks()
  const params = useParams()
  const folderId = params.id as string

  // Find the current folder
  useEffect(() => {
    if (folderId && folders.length > 0) {
      const currentFolder = folders.find((f) => f.id === folderId)
      if (currentFolder) {
        setFolder(currentFolder)
      }
    }
  }, [folderId, folders])

  // Filter tasks for this folder
  const folderTasks = tasks.filter((task) => task.folderId === folderId && !task.completed)
  const completedTasks = tasks.filter((task) => task.folderId === folderId && task.completed)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 dark:border-violet-400"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!folder) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-bold mb-2">Folder not found</h2>
            <p className="text-gray-500 dark:text-gray-400">The folder you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`h-4 w-4 rounded-full ${folder.color}`}></div>
          <h1 className="text-2xl font-bold">{folder.name}</h1>
        </div>

        <TaskList title="Tasks" tasks={folderTasks} folder={folder} />

        {completedTasks.length > 0 && (
          <div className="mt-8">
            <TaskList title="Completed" tasks={completedTasks} folder={folder} showAddTask={false} />
          </div>
        )}

        {selectedTaskId && <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
      </div>
    </DashboardLayout>
  )
}
