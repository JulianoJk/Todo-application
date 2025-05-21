import { log } from "node:console";
import type { AuthUser, Task, Folder } from "./types";

// Base API URL - should be configured from environment variables in production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message || data?.error || `API error: ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// Helper function to make authenticated requests
async function authenticatedRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: unknown,
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) headers["x-access-token"] = token;

  const config: RequestInit = {
    method,
    headers,
  };

  if (data !== undefined) {
    config.body = JSON.stringify(data);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, config);
}

// ==================== User Authentication API ====================

/**
 * Register a new user
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await authenticatedRequest("/users/register", "POST", {
    username,
    email,
    password,
  });
  return handleResponse<AuthUser>(response);
}

/**
 * Login a user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await authenticatedRequest("/users/login", "POST", {
    email,
    password,
  });
  return handleResponse<AuthUser>(response);
}

/**
 * Get user profile
 */
export async function getUserProfile(token: string): Promise<AuthUser> {
  const response = await authenticatedRequest(
    "/users/profile",
    "GET",
    undefined,
    token
  );
  return handleResponse<AuthUser>(response);
}

// ==================== Task Management API ====================

/**
 * Get all tasks for a user
 */
export async function getTasks(userId: string, token: string): Promise<Task[]> {
  const response = await authenticatedRequest(
    `/tasks/get/${userId}`,
    "GET",
    undefined,
    token
  );
  const data = await handleResponse<Task[]>(response);

  // Map _id to id
  return data.map((task: any) => ({
    ...task,
    id: task._id,
  }));
}

/**
 * Create a new task
 */
export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<Task> {
  const response = await authenticatedRequest(
    "/tasks/add",
    "POST",
    task,
    token
  );
  return handleResponse<Task>(response);
}

/**
 * Update an existing task
 */
export async function updateTask(
  _id: string,
  updates: Partial<Task>,
  token: string
): Promise<Task> {
  const response = await authenticatedRequest(
    "/tasks/update",
    "PUT",
    { _id, ...updates },
    token
  );
  return handleResponse<Task>(response);
}

/**
 * Delete a task
 */
export async function deleteTask(_id: string, token: string): Promise<void> {
  const response = await authenticatedRequest(
    "/tasks/delete",
    "DELETE",
    { _id },
    token
  );
  return handleResponse<void>(response);
}

/**
 * Toggle task completion status
 */
export async function toggleTaskCompletion(
  taskId: string,
  completed: boolean,
  token: string
): Promise<Task> {
  return updateTask(taskId, { completed }, token);
}

/**
 * Update task priority
 */
export async function updateTaskPriority(
  taskId: string,
  priority: Task["priority"],
  token: string
): Promise<Task> {
  return updateTask(taskId, { priority }, token);
}

/**
 * Update task due date
 */
export async function updateTaskDueDate(
  taskId: string,
  dueDate: string | undefined,
  token: string
): Promise<Task> {
  return updateTask(taskId, { dueDate }, token);
}

/**
 * Add label to task
 */
export async function addLabelToTask(
  taskId: string,
  label: string,
  token: string
): Promise<Task> {
  const task = await getTaskById(taskId, token);
  const labels = [...(task.labels || []), label];
  return updateTask(taskId, { labels }, token);
}

/**
 * Remove label from task
 */
export async function removeLabelFromTask(
  taskId: string,
  label: string,
  token: string
): Promise<Task> {
  const task = await getTaskById(taskId, token);
  const labels = (task.labels || []).filter((l) => l !== label);
  return updateTask(taskId, { labels }, token);
}

/**
 * Get a single task by ID
 */
export async function getTaskById(
  taskId: string,
  token: string
): Promise<Task> {
  // This endpoint might need to be implemented on the backend
  // For now, we'll get all tasks and filter
  const response = await authenticatedRequest(
    `/tasks/get/${taskId}`,
    "GET",
    undefined,
    token
  );
  return handleResponse<Task>(response);
}

// ==================== Folder Management API ====================

/**
 * Get all folders for a user
 */
export async function getFolders(
  userId: string,
  token: string
): Promise<Folder[]> {
  const response = await authenticatedRequest(
    `/folders/get/${userId}`,
    "GET",
    undefined,
    token
  );
  return handleResponse<Folder[]>(response);
}

/**
 * Create a new folder
 */
export async function createFolder(
  folder: Omit<Folder, "id" | "createdAt" | "updatedAt">,
  token: string
): Promise<Folder> {
  const response = await authenticatedRequest(
    "/folders/add",
    "POST",
    folder,
    token
  );
  return handleResponse<Folder>(response);
}

/**
 * Update an existing folder
 */
export async function updateFolder(
  folderId: string,
  updates: Partial<Folder>,
  token: string
): Promise<Folder> {
  const response = await authenticatedRequest(
    "/folders/update",
    "PUT",
    { folderId, ...updates },
    token
  );
  return handleResponse<Folder>(response);
}

/**
 * Delete a folder
 */
export async function deleteFolder(
  folderId: string,
  token: string
): Promise<void> {
  const response = await authenticatedRequest(
    "/folders/delete",
    "DELETE",
    { folderId },
    token
  );
  return handleResponse<void>(response);
}

/**
 * Move a task to a different folder
 */
export async function moveTaskToFolder(
  taskId: string,
  folderId: string,
  token: string
): Promise<Task> {
  return updateTask(taskId, { folderId }, token);
}
