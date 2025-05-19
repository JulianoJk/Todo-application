"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  SunIcon,
  MoonIcon,
  ListTodoIcon,
  InboxIcon,
  CalendarIcon,
  StarIcon,
  SettingsIcon,
  LogOutIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  FilterIcon,
  SearchIcon,
  XIcon,
  UserIcon,
  BellIcon,
  BarChart2Icon,
  CheckIcon,
  AlertCircleIcon,
} from "lucide-react"
import { useUser } from "@/context/user-context"
import { useTasks } from "@/context/task-context"

export function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [newTask, setNewTask] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "active">("all")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useUser()
  const { tasks, setTasks, loading } = useTasks()

  const userMenuRef = useRef<HTMLDivElement>(null)
  const filterMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Generate demo tasks if none exist
  useEffect(() => {
    if (user && tasks.length === 0 && !loading) {
      const demoTasks = [
        {
          _id: "task1",
          name: "Welcome to Planyze! Click the checkbox to mark as complete",
          completed: false,
          user_id: user.id,
        },
        {
          _id: "task2",
          name: "Edit tasks by clicking the pencil icon",
          completed: false,
          user_id: user.id,
        },
        {
          _id: "task3",
          name: "Delete tasks by clicking the trash icon",
          completed: false,
          user_id: user.id,
        },
        {
          _id: "task4",
          name: "Add new tasks using the input field above",
          completed: true,
          user_id: user.id,
        },
      ]
      setTasks(demoTasks)
    }
  }, [user, tasks.length, loading, setTasks])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleColorScheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || (activeFilter === "completed" ? task.completed : !task.completed)
    return matchesSearch && matchesFilter
  })

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim() || !user) return

    try {
      // For demo purposes, create a task without API call
      const newTaskObj = {
        _id: `task-${Date.now()}`,
        name: newTask,
        completed: false,
        user_id: user.id,
      }

      setTasks([...tasks, newTaskObj])
      setNewTask("")
      toast.success("Task added successfully")
    } catch (error) {
      toast.error("Failed to add task")
    }
  }

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    if (!user) return

    try {
      // For demo purposes, update task without API call
      setTasks(tasks.map((task) => (task._id === taskId ? { ...task, completed: !completed } : task)))
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteTask = async () => {
    if (!user || !taskToDelete) return

    try {
      // For demo purposes, delete task without API call
      setTasks(tasks.filter((task) => task._id !== taskToDelete))
      toast.success("Task deleted successfully")
      setIsDeleteModalOpen(false)
      setTaskToDelete(null)
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

  const startEditingTask = (taskId: string, taskName: string) => {
    setEditingTaskId(taskId)
    setEditingTaskText(taskName)
  }

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTaskId || !editingTaskText.trim() || !user) return

    try {
      // For demo purposes, edit task without API call
      setTasks(tasks.map((task) => (task._id === editingTaskId ? { ...task, name: editingTaskText } : task)))
      setEditingTaskId(null)
      setEditingTaskText("")
      toast.success("Task updated successfully")
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingTaskText("")
  }

  // Demo notifications
  const demoNotifications = [
    {
      id: 1,
      title: "Task due soon",
      message: "You have a task due in 2 hours",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Task completed",
      message: "You've completed 3 tasks today!",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 3,
      title: "Welcome to Planyze",
      message: "Thanks for joining Planyze. Start by creating your first task!",
      time: "1 day ago",
      read: true,
    },
  ]

  const unreadNotifications = demoNotifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="mr-4 md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-current transform transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`block h-0.5 bg-current transform transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>
            <Link href="/" className="flex items-center">
              <ListTodoIcon className={`h-6 w-6 ${isDark ? "text-violet-400" : "text-violet-700"}`} />
              <span className={`ml-2 text-lg font-bold ${isDark ? "text-violet-400" : "text-violet-700"}`}>
                Planyze
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {showMobileSearch ? (
              <div className="absolute inset-x-0 top-0 p-4 bg-white dark:bg-slate-800 md:hidden flex items-center z-20">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                  autoFocus
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Search"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
                <div className="hidden md:block relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                  />
                  <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            )}

            <button
              onClick={toggleColorScheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {demoNotifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                    ) : (
                      demoNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 ${
                            !notification.read ? "bg-violet-50 dark:bg-violet-900/20" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full py-2 text-sm text-center text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors p-1"
              >
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.username || "User"}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium">{user?.username || "User"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/statistics"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BarChart2Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      Statistics
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <SettingsIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      Settings
                    </Link>
                  </div>
                  <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOutIcon className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 left-0 z-20 pt-16 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:z-0`}
        >
          <div className="h-full flex flex-col p-4 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 bg-violet-50 dark:bg-violet-900/20 rounded-lg font-medium"
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
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Today</span>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Important</span>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>

              <div className="pt-4 pb-2">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Lists
                  </h3>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-3"></span>
                  <span>Personal</span>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-pink-500 mr-3"></span>
                  <span>Work</span>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-3"></span>
                  <span>Shopping</span>
                </div>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  0
                </span>
              </Link>
            </nav>

            <div className="pt-4">
              <button className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>Add List</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pt-0 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Inbox</h1>

              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span>{activeFilter === "all" ? "All" : activeFilter === "completed" ? "Completed" : "Active"}</span>
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => {
                        setActiveFilter("all")
                        setIsFilterMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeFilter === "all"
                          ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("active")
                        setIsFilterMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeFilter === "active"
                          ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("completed")
                        setIsFilterMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        activeFilter === "completed"
                          ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800"
                >
                  Add Task
                </button>
              </form>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600 dark:border-violet-400"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <InboxIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery
                    ? "No tasks match your search"
                    : activeFilter !== "all"
                      ? `No ${activeFilter} tasks found`
                      : "No tasks yet. Add your first task above!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ${
                      task.completed ? "opacity-70" : ""
                    } ${editingTaskId === task._id ? "ring-2 ring-violet-200 dark:ring-violet-800" : ""}`}
                  >
                    {editingTaskId === task._id ? (
                      <form onSubmit={handleEditTask} className="flex gap-2">
                        <input
                          type="text"
                          value={editingTaskText}
                          onChange={(e) => setEditingTaskText(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 pt-0.5">
                            <button
                              onClick={() => handleToggleComplete(task._id, task.completed)}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                task.completed
                                  ? "bg-violet-600 dark:bg-violet-700 border-violet-600 dark:border-violet-700"
                                  : "border-gray-300 dark:border-gray-600 hover:border-violet-500 dark:hover:border-violet-500"
                              }`}
                              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
                            </button>
                          </div>
                          <span
                            className={`text-gray-800 dark:text-gray-200 truncate ${
                              task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
                            }`}
                          >
                            {task.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => startEditingTask(task._id, task.name)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            aria-label="Edit task"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteTask(task._id)}
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            aria-label="Delete task"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <AlertCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Confirm deletion</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-10 md:hidden" onClick={closeMenu}></div>
      )}
    </div>
  )
}
