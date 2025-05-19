"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AuthContextType, AuthUser } from "@/lib/types";
import { generateId } from "@/lib/utils";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_API_URL = "http://localhost:5050/";

// Demo user for quick access
const DEMO_USER: AuthUser = {
  username: "Demo User",
  id: "demo-user-id",
  email: "demo@example.com",
  token: "demo-token-123456789",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("planyze-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("planyze-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<AuthUser | Error> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_API_URL}api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMsg = (await response.json())?.message || "Login failed";
        toast.error(errorMsg);
        return new Error(errorMsg);
      }
      const loginResults: AuthUser = await response.json();
      if (!loginResults) {
        toast.error("Invalid response from server");
        return new Error("Invalid response from server");
      }

      setUser(loginResults);
      localStorage.setItem("planyze-user", JSON.stringify(loginResults));
      toast.success(loginResults.message || "Logged in successfully");
      return loginResults;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      return new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthUser | Error> => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await fetch(`${BASE_API_URL}api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      if (!response.ok) {
        const errorMsg = (await response.json())?.message || "Login failed";
        toast.error(errorMsg);
        return new Error(errorMsg);
      }
      const registerResults: AuthUser = await response.json();
      if (!registerResults) {
        toast.error("Invalid response from server");
        return new Error("Invalid response from server");
      }
      console.log("Register result:", registerResults);

      setUser(registerResults);
      localStorage.setItem("planyze-user", JSON.stringify(registerResults));
      toast.success(registerResults.message || "Logged in successfully");

      // Initialize empty folders and tasks for the new user
      const folders = JSON.parse(
        localStorage.getItem("planyze-folders") || "[]"
      );
      const tasks = JSON.parse(localStorage.getItem("planyze-tasks") || "[]");

      // Create default folder
      const defaultFolder = {
        id: generateId(),
        name: "Inbox",
        color: "bg-violet-500",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      folders.push(defaultFolder);
      localStorage.setItem("planyze-folders", JSON.stringify(folders));

      toast.success("Account created successfully");
      return registerResults;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return error;
      }
      toast.error("An unexpected error occurred");
      return new Error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("planyze-user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // Login with demo account
  const loginWithDemo = async (): Promise<AuthUser | Error> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

      setUser(DEMO_USER);
      localStorage.setItem("planyze-user", JSON.stringify(DEMO_USER));

      // Initialize demo data if it doesn't exist
      initializeDemoData(DEMO_USER.id);

      toast.success("Logged in with demo account");
      return DEMO_USER;
    } catch (error) {
      toast.error("Failed to login with demo account");
      return new Error("Failed to login with demo account");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize demo data
  const initializeDemoData = (userId: string) => {
    // Create demo folders if they don't exist
    const folders = JSON.parse(localStorage.getItem("planyze-folders") || "[]");
    const userFolders = folders.filter((f: any) => f.userId === userId);

    if (userFolders.length === 0) {
      const demoFolders = [
        {
          id: "folder-inbox",
          name: "Inbox",
          color: "bg-violet-500",
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "folder-work",
          name: "Work",
          color: "bg-blue-500",
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "folder-personal",
          name: "Personal",
          color: "bg-green-500",
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      folders.push(...demoFolders);
      localStorage.setItem("planyze-folders", JSON.stringify(folders));
    }

    // Create demo tasks if they don't exist
    const tasks = JSON.parse(localStorage.getItem("planyze-tasks") || "[]");
    const userTasks = tasks.filter((t: any) => t.userId === userId);

    if (userTasks.length === 0) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const demoTasks = [
        {
          id: "task-1",
          title: "Welcome to Planyze!",
          description:
            "This is a demo task. You can edit, delete, or mark it as complete.",
          completed: false,
          priority: "medium",
          folderId: "folder-inbox",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
          labels: ["welcome", "demo"],
        },
        {
          id: "task-2",
          title: "Try dragging tasks between folders",
          description:
            "You can drag and drop tasks between folders to organize them.",
          completed: false,
          priority: "high",
          dueDate: tomorrow.toISOString(),
          folderId: "folder-inbox",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
          labels: ["tutorial"],
        },
        {
          id: "task-3",
          title: "Create a new task",
          description: "Click the + button to create a new task.",
          completed: true,
          priority: "low",
          folderId: "folder-work",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
        },
        {
          id: "task-4",
          title: "Explore task details",
          description: "Click on a task to view and edit its details.",
          completed: false,
          priority: "none",
          folderId: "folder-personal",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
        },
      ];

      tasks.push(...demoTasks);
      localStorage.setItem("planyze-tasks", JSON.stringify(tasks));
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    loginWithDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
