// User types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  message?: string;
}

export interface AuthUser extends User {
  token: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high" | "none";
  dueDate?: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  labels?: string[];
}

// Folder types
export interface Folder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth context types
export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | Error>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<AuthUser | Error>;
  logout: () => void;
  loginWithDemo: () => Promise<AuthUser | Error>;
}

// Task context types
export interface TaskContextType {
  tasks: Task[];
  folders: Folder[];
  isLoading: boolean;
  createTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<Task>;
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  createFolder: (
    folder: Omit<Folder, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<Folder>;
  updateFolder: (id: string, folder: Partial<Folder>) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  moveTask: (taskId: string, folderId: string) => Promise<Task>;
}
