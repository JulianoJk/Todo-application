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
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
  moveTaskToFolder as apiMoveTask,
  getFolders,
} from "@/lib/api";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const SYSTEM_FOLDERS: Record<
  "inbox" | "today" | "important",
  {
    name: string;
    color: string;
    icon: string;
  }
> = {
  inbox: { name: "Inbox", color: "bg-violet-500", icon: "📥" },
  today: { name: "Today", color: "bg-blue-500", icon: "📅" },
  important: { name: "Important", color: "bg-yellow-500", icon: "⭐" },
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadData(user.id, user.token);
    else resetData();
  }, [user]);

  const resetData = () => {
    setTasks([]);
    setFolders([]);
    setIsLoading(false);
  };

  const loadData = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(userId, token);
      setTasks(fetchedTasks);

      const allFolders = await getFolders(userId, token);
      const userFolders = allFolders.filter((f) => f.userId === userId);

      const ensuredSystemFolders: Folder[] = (
        Object.entries(SYSTEM_FOLDERS) as [
          "inbox" | "today" | "important",
          { name: string; color: string; icon: string }
        ][]
      ).map(([type, meta]) => {
        const existing = userFolders.find((f) => f.systemType === type);
        if (existing) return existing;

        return {
          id: `system-${type}`,
          userId,
          isSystem: true,
          systemType: type,
          name: meta.name,
          color: meta.color,
          icon: meta.icon,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      setFolders([...ensuredSystemFolders, ...userFolders]);
      toast.success("Tasks and folders loaded successfully");
    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("Failed to load tasks or folders");
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (
    task: Omit<Task, "_id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<Task> => {
    if (!user) throw new Error("User not authenticated");

    const fallbackInbox = folders.find((f) => f.systemType === "inbox");
    if (!task.folderId && !fallbackInbox?.id) {
      throw new Error("No folder specified and default inbox not found.");
    }

    try {
      const newTask = await apiCreateTask(
        {
          ...task,
          userId: user.id,
          folderId: task.folderId ?? fallbackInbox!.id,
          _id: ""
        },
        user.token
      );
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
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updated : task))
      );
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
      setTasks((prev) => prev.filter((task) => task._id !== id));
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
        prev.map((task) => (task._id === taskId ? updatedTask : task))
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
    setTasks,
    loading: isLoading,
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
