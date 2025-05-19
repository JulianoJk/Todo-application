"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  InboxIcon,
  CalendarIcon,
  StarIcon,
  PlusIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  XIcon,
} from "lucide-react"
import { useTasks } from "@/context/task-context"
import type { Folder } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const [openFolderMenuId, setOpenFolderMenuId] = useState<string | null>(null)
  const { folders, tasks, createFolder, updateFolder, deleteFolder } = useTasks()
  const pathname = usePathname()

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    try {
      await createFolder({
        name: newFolderName.trim(),
        color: `bg-${["violet", "blue", "green", "red", "yellow", "pink"][Math.floor(Math.random() * 6)]}-500`,
      })
      setNewFolderName("")
      setIsCreatingFolder(false)
    } catch (error) {
      console.error("Failed to create folder", error)
    }
  }

  const handleEditFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFolderId || !editingFolderName.trim()) return

    try {
      await updateFolder(editingFolderId, { name: editingFolderName.trim() })
      setEditingFolderId(null)
      setEditingFolderName("")
    } catch (error) {
      console.error("Failed to update folder", error)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // Check if folder has tasks
      const folderTasks = tasks.filter((task) => task.folderId === folderId)
      if (folderTasks.length > 0) {
        toast.error("Cannot delete folder with tasks. Move or delete the tasks first.")
        return
      }

      await deleteFolder(folderId)
      setOpenFolderMenuId(null)
    } catch (error) {
      console.error("Failed to delete folder", error)
    }
  }

  const startEditingFolder = (folder: Folder) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
    setOpenFolderMenuId(null)
  }

  const cancelEditing = () => {
    setEditingFolderId(null)
    setEditingFolderName("")
  }

  const toggleFolderMenu = (folderId: string) => {
    setOpenFolderMenuId(openFolderMenuId === folderId ? null : folderId)
  }

  return (
    <aside
      className={`w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 left-0 z-20 pt-16 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:z-0`}
    >
      <div className="h-full flex flex-col p-4 overflow-y-auto">
        <nav className="flex-1 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <InboxIcon className="h-5 w-5 mr-3 text-violet-600 dark:text-violet-400" />
              <span>Inbox</span>
            </div>
            <span className="bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {tasks.filter((t) => !t.completed).length}
            </span>
          </Link>
          <Link
            href="/dashboard/today"
            className={cn(
              "flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg transition-colors",
              pathname === "/dashboard/today"
                ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              <span>Today</span>
            </div>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {
                tasks.filter((t) => {
                  if (!t.dueDate) return false
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const dueDate = new Date(t.dueDate)
                  dueDate.setHours(0, 0, 0, 0)
                  return dueDate.getTime() === today.getTime()
                }).length
              }
            </span>
          </Link>
          <Link
            href="/dashboard/important"
            className={cn(
              "flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg transition-colors",
              pathname === "/dashboard/important"
                ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
            )}
            onClick={closeMenu}
          >
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              <span>Important</span>
            </div>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {tasks.filter((t) => t.priority === "high").length}
            </span>
          </Link>

          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between px-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Folders</h3>
            </div>
          </div>

          {folders.map((folder) => (
            <div key={folder.id} className="relative">
              {editingFolderId === folder.id ? (
                <form onSubmit={handleEditFolder} className="px-3 py-1 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-slate-900"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <Link
                  href={`/dashboard/folders/${folder.id}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg group transition-colors",
                    pathname === `/dashboard/folders/${folder.id}`
                      ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full ${folder.color} mr-3`}></span>
                    <span className="truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full mr-1">
                      {tasks.filter((t) => t.folderId === folder.id).length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFolderMenu(folder.id)
                      }}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              )}

              {openFolderMenuId === folder.id && (
                <div className="absolute right-2 mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 animate-scale-in">
                  <button
                    onClick={() => startEditingFolder(folder)}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {isCreatingFolder ? (
            <form onSubmit={handleCreateFolder} className="px-3 py-1 animate-fade-in">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-slate-900"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mt-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Add Folder</span>
            </button>
          )}
        </nav>
      </div>
    </aside>
  )
}

// Helper component for the check icon
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
