"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import type { TaskContextType, Task, Folder } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { generateId } from "@/lib/utils"

// Create the task context
const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load tasks and folders when user changes
  useEffect(() => {
    if (user) {
      loadUserData(user.id)
    } else {
      setTasks([])
      setFolders([])
      setIsLoading(false)
    }
  }, [user])

  // Load user data from localStorage
  const loadUserData = async (userId: string) => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Load folders
      const storedFolders = localStorage.getItem("planyze-folders") || "[]"
      const allFolders = JSON.parse(storedFolders)
      const userFolders = allFolders.filter((folder: Folder) => folder.userId === userId)
      setFolders(userFolders)

      // Load tasks
      const storedTasks = localStorage.getItem("planyze-tasks") || "[]"
      const allTasks = JSON.parse(storedTasks)
      const userTasks = allTasks.filter((task: Task) => task.userId === userId)
      setTasks(userTasks)
    } catch (error) {
      console.error("Failed to load user data", error)
      toast.error("Failed to load your tasks and folders")
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new task
  const createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Task> => {
    if (!user) throw new Error("You must be logged in to create tasks")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const now = new Date().toISOString()
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        userId: user.id,
      }

      // Update local state
      setTasks((prev) => [...prev, newTask])

      // Update localStorage
      const storedTasks = localStorage.getItem("planyze-tasks") || "[]"
      const allTasks = JSON.parse(storedTasks)
      allTasks.push(newTask)
      localStorage.setItem("planyze-tasks", JSON.stringify(allTasks))

      toast.success("Task created successfully")
      return newTask
    } catch (error) {
      console.error("Failed to create task", error)
      toast.error("Failed to create task")
      throw error
    }
  }

  // Update an existing task
  const updateTask = async (id: string, taskUpdate: Partial<Task>): Promise<Task> => {
    if (!user) throw new Error("You must be logged in to update tasks")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Find the task to update
      const taskIndex = tasks.findIndex((t) => t.id === id)
      if (taskIndex === -1) throw new Error("Task not found")

      // Update the task
      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...taskUpdate,
        updatedAt: new Date().toISOString(),
      }

      // Update local state
      const updatedTasks = [...tasks]
      updatedTasks[taskIndex] = updatedTask
      setTasks(updatedTasks)

      // Update localStorage
      const storedTasks = localStorage.getItem("planyze-tasks") || "[]"
      const allTasks = JSON.parse(storedTasks)
      const globalTaskIndex = allTasks.findIndex((t: Task) => t.id === id)
      if (globalTaskIndex !== -1) {
        allTasks[globalTaskIndex] = updatedTask
        localStorage.setItem("planyze-tasks", JSON.stringify(allTasks))
      }

      toast.success("Task updated successfully")
      return updatedTask
    } catch (error) {
      console.error("Failed to update task", error)
      toast.error("Failed to update task")
      throw error
    }
  }

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to delete tasks")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Update local state
      setTasks((prev) => prev.filter((task) => task.id !== id))

      // Update localStorage
      const storedTasks = localStorage.getItem("planyze-tasks") || "[]"
      const allTasks = JSON.parse(storedTasks)
      const updatedTasks = allTasks.filter((task: Task) => task.id !== id)
      localStorage.setItem("planyze-tasks", JSON.stringify(updatedTasks))

      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Failed to delete task", error)
      toast.error("Failed to delete task")
      throw error
    }
  }

  // Create a new folder
  const createFolder = async (folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Folder> => {
    if (!user) throw new Error("You must be logged in to create folders")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const now = new Date().toISOString()
      const newFolder: Folder = {
        ...folder,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        userId: user.id,
      }

      // Update local state
      setFolders((prev) => [...prev, newFolder])

      // Update localStorage
      const storedFolders = localStorage.getItem("planyze-folders") || "[]"
      const allFolders = JSON.parse(storedFolders)
      allFolders.push(newFolder)
      localStorage.setItem("planyze-folders", JSON.stringify(allFolders))

      toast.success("Folder created successfully")
      return newFolder
    } catch (error) {
      console.error("Failed to create folder", error)
      toast.error("Failed to create folder")
      throw error
    }
  }

  // Update an existing folder
  const updateFolder = async (id: string, folderUpdate: Partial<Folder>): Promise<Folder> => {
    if (!user) throw new Error("You must be logged in to update folders")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Find the folder to update
      const folderIndex = folders.findIndex((f) => f.id === id)
      if (folderIndex === -1) throw new Error("Folder not found")

      // Update the folder
      const updatedFolder: Folder = {
        ...folders[folderIndex],
        ...folderUpdate,
        updatedAt: new Date().toISOString(),
      }

      // Update local state
      const updatedFolders = [...folders]
      updatedFolders[folderIndex] = updatedFolder
      setFolders(updatedFolders)

      // Update localStorage
      const storedFolders = localStorage.getItem("planyze-folders") || "[]"
      const allFolders = JSON.parse(storedFolders)
      const globalFolderIndex = allFolders.findIndex((f: Folder) => f.id === id)
      if (globalFolderIndex !== -1) {
        allFolders[globalFolderIndex] = updatedFolder
        localStorage.setItem("planyze-folders", JSON.stringify(allFolders))
      }

      toast.success("Folder updated successfully")
      return updatedFolder
    } catch (error) {
      console.error("Failed to update folder", error)
      toast.error("Failed to update folder")
      throw error
    }
  }

  // Delete a folder
  const deleteFolder = async (id: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to delete folders")

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check if folder has tasks
      const folderTasks = tasks.filter((task) => task.folderId === id)
      if (folderTasks.length > 0) {
        throw new Error("Cannot delete folder with tasks. Move or delete the tasks first.")
      }

      // Update local state
      setFolders((prev) => prev.filter((folder) => folder.id !== id))

      // Update localStorage
      const storedFolders = localStorage.getItem("planyze-folders") || "[]"
      const allFolders = JSON.parse(storedFolders)
      const updatedFolders = allFolders.filter((folder: Folder) => folder.id !== id)
      localStorage.setItem("planyze-folders", JSON.stringify(updatedFolders))

      toast.success("Folder deleted successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        console.error("Failed to delete folder", error)
        toast.error("Failed to delete folder")
      }
      throw error
    }
  }

  // Move a task to a different folder
  const moveTask = async (taskId: string, folderId: string): Promise<Task> => {
    if (!user) throw new Error("You must be logged in to move tasks")

    try {
      // Find the task to move
      const taskIndex = tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) throw new Error("Task not found")

      // Update the task
      const updatedTask: Task = {
        ...tasks[taskIndex],
        folderId,
        updatedAt: new Date().toISOString(),
      }

      // Update local state
      const updatedTasks = [...tasks]
      updatedTasks[taskIndex] = updatedTask
      setTasks(updatedTasks)

      // Update localStorage
      const storedTasks = localStorage.getItem("planyze-tasks") || "[]"
      const allTasks = JSON.parse(storedTasks)
      const globalTaskIndex = allTasks.findIndex((t: Task) => t.id === taskId)
      if (globalTaskIndex !== -1) {
        allTasks[globalTaskIndex] = updatedTask
        localStorage.setItem("planyze-tasks", JSON.stringify(allTasks))
      }

      toast.success("Task moved successfully")
      return updatedTask
    } catch (error) {
      console.error("Failed to move task", error)
      toast.error("Failed to move task")
      throw error
    }
  }

  const value = {
    tasks,
    folders,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    createFolder,
    updateFolder,
    deleteFolder,
    moveTask,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
