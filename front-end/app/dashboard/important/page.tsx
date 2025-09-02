"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskDetail } from "@/components/dashboard/task-detail"
import { useTasks } from "@/context/task-context"

export default function ImportantPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { tasks, isLoading } = useTasks()

  // Filter high priority tasks
  const importantTasks = tasks.filter((task) => task.priority === "high" && !task.completed)
  const completedImportantTasks = tasks.filter((task) => task.priority === "high" && task.completed)

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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Important</h1>

        <TaskList title="High Priority" tasks={importantTasks} />

        {completedImportantTasks.length > 0 && (
          <div className="mt-8">
            <TaskList title="Completed" tasks={completedImportantTasks} showAddTask={false} />
          </div>
        )}

        {selectedTaskId && <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
      </div>
    </DashboardLayout>
  )
}
