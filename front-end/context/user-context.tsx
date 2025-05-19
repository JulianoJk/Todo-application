"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { IUserInfoContext } from "@/lib/models"

interface UserContextType {
  user: IUserInfoContext | null
  setUser: (user: IUserInfoContext | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserInfoContext | null>(null)

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  useEffect(() => {
    // Save user data to localStorage when it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
