"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { TaskContextType, Task, Folder } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import {
  getTasks as fetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
  moveTaskToFolder as apiMoveTask,
} from "@/lib/api";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeUserData(user.id, user.token);
    } else {
      setTasks([]);
      setFolders([]);
      setIsLoading(false);
    }
  }, [user]);

  const initializeUserData = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      const storedFolders = JSON.parse(
        localStorage.getItem("planyze-folders") || "[]"
      );
      const userFolders = storedFolders.filter(
        (folder: Folder) => folder.userId === userId
      );
      setFolders(userFolders);

      const userTasks = await fetchTasks(userId, token);
      setTasks(userTasks);
      toast.success("Tasks loaded successfully");
    } catch (error) {
      console.error("Failed to load user data", error);
      toast.error("Failed to load tasks or folders");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<Task> => {
    if (!user) throw new Error("User not authenticated");
    try {
      const taskWithUser = { ...task, userId: user.id };
      const newTask = await apiCreateTask(taskWithUser, user.token);
      setTasks((prev) => [...prev, newTask]);
      toast.success("Task created");
      return newTask;
    } catch (error) {
      console.error("Create task failed", error);
      toast.error("Could not create task");
      throw error;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Task>
  ): Promise<Task> => {
    if (!user) throw new Error("User not authenticated");
    try {
      const updated = await apiUpdateTask(id, updates, user.token);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      toast.success("Task updated");
      return updated;
    } catch (error) {
      console.error("Update task failed", error);
      toast.error("Could not update task");
      throw error;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    try {
      await apiDeleteTask(id, user.token);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Delete task failed", error);
      toast.error("Could not delete task");
      throw error;
    }
  };

  const createFolder = async (
    folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<Folder> => {
    if (!user) throw new Error("User not authenticated");
    try {
      const newFolder = await apiCreateFolder(
        { ...folder, userId: user.id },
        user.token
      );
      setFolders((prev) => [...prev, newFolder]);
      toast.success("Folder created");
      return newFolder;
    } catch (error) {
      console.error("Create folder failed", error);
      toast.error("Could not create folder");
      throw error;
    }
  };

  const updateFolder = async (
    id: string,
    updates: Partial<Folder>
  ): Promise<Folder> => {
    if (!user) throw new Error("User not authenticated");
    try {
      const updatedFolder = await apiUpdateFolder(id, updates, user.token);
      setFolders((prev) =>
        prev.map((folder) => (folder.id === id ? updatedFolder : folder))
      );
      toast.success("Folder updated");
      return updatedFolder;
    } catch (error) {
      console.error("Update folder failed", error);
      toast.error("Could not update folder");
      throw error;
    }
  };

  const deleteFolder = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    try {
      await apiDeleteFolder(id, user.token);
      setFolders((prev) => prev.filter((folder) => folder.id !== id));
      toast.success("Folder deleted");
    } catch (error) {
      console.error("Delete folder failed", error);
      toast.error("Could not delete folder");
      throw error;
    }
  };

  const moveTask = async (taskId: string, folderId: string): Promise<Task> => {
    if (!user) throw new Error("User not authenticated");
    try {
      const updatedTask = await apiMoveTask(taskId, folderId, user.token);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      toast.success("Task moved");
      return updatedTask;
    } catch (error) {
      console.error("Move task failed", error);
      toast.error("Could not move task");
      throw error;
    }
  };

  const value: TaskContextType = {
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
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
