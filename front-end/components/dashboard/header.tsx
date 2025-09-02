"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  SunIcon,
  MoonIcon,
  ListTodoIcon,
  SearchIcon,
  XIcon,
  UserIcon,
  BellIcon,
  BarChart2Icon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { cn, debounce } from "@/lib/utils"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
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

  const isDark = theme === "dark"

  const toggleColorScheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  // Debounced search handler for performance
  const debouncedSearch = debounce((value: string) => {
    // This would typically trigger a search action
    console.log("Searching for:", value)
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
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
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="mr-4 md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="block h-0.5 bg-current"></span>
              <span className="block h-0.5 bg-current"></span>
              <span className="block h-0.5 bg-current"></span>
            </div>
          </button>
          <Link href="/dashboard" className="flex items-center">
            <ListTodoIcon className={`h-6 w-6 ${isDark ? "text-violet-400" : "text-violet-700"}`} />
            <span className={`ml-2 text-lg font-bold ${isDark ? "text-violet-400" : "text-violet-700"}`}>Planyze</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {showMobileSearch ? (
            <div className="absolute inset-x-0 top-0 p-4 bg-white dark:bg-slate-800 md:hidden flex items-center z-20 animate-fade-in">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                  onChange={handleSearchChange}
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
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button
                    className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                    onClick={() => toast.success("All notifications marked as read")}
                  >
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
                        className={cn(
                          "p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                          !notification.read && "bg-violet-50 dark:bg-violet-900/20",
                        )}
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
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-medium">{user?.username || "User"}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</div>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserIcon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/statistics"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <BarChart2Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                    Statistics
                  </Link>
                  <Link
                    href="/dashboard/settings"
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
  )
}
