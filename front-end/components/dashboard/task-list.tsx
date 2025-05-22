"use client";

import type React from "react";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  PlusIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  CalendarIcon,
  FlagIcon,
  TagIcon,
} from "lucide-react";
import { useTasks } from "@/context/task-context";
import type { Task, Folder } from "@/lib/types";
import { formatDate, getDueDateStatus } from "@/lib/utils";
import { TaskDetail } from "./task-detail";

interface TaskListProps {
  title: string;
  tasks: Task[];
  folder?: Folder;
  showAddTask?: boolean;
}

export function TaskList({
  title,
  tasks,
  folder,
  showAddTask = true,
}: TaskListProps) {
  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { createTask, updateTask, deleteTask, folders } = useTasks();
  const taskListRef = useRef<HTMLDivElement>(null);
  const hasTaskMeta = (task: Task) =>
    Boolean(
      task.dueDate ||
        task.priority !== "none" ||
        (task.labels && task.labels.length > 0)
    );

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await createTask({
        title: newTask.trim(),
        completed: false,
        priority: "none",
        folderId: folder?.id || folders[0]?.id,
        description: "",
      });
      setNewTask("");
      setIsAddingTask(false);

      // Scroll to bottom of task list after adding
      if (taskListRef.current) {
        setTimeout(() => {
          taskListRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !editingTaskText.trim()) return;

    try {
      await updateTask(editingTaskId, { title: editingTaskText.trim() });
      setEditingTaskId(null);
      setEditingTaskText("");
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task._id);
    setEditingTaskText(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 dark:text-red-400";
      case "medium":
        return "text-orange-500 dark:text-orange-400";
      case "low":
        return "text-blue-500 dark:text-blue-400";
      default:
        return "text-gray-400 dark:text-gray-500";
    }
  };

  const getDueDateClass = (dueDate?: string) => {
    if (!dueDate) return "";

    const status = getDueDateStatus(dueDate);
    switch (status) {
      case "overdue":
        return "text-red-500 dark:text-red-400";
      case "today":
        return "text-orange-500 dark:text-orange-400";
      case "upcoming":
        return "text-blue-500 dark:text-blue-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4" ref={taskListRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        {showAddTask && (
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {isAddingTask && (
        <form
          onSubmit={handleAddTask}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 animate-fade-in"
        >
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900 mb-2"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        {folders.map((folder: any) => (
          <div
            key={folder.id}
            className={`rounded-lg ${
              tasks.some((task) => task.folderId === folder.id)
                ? "border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-1"
                : ""
            }`}
          >
            {tasks.filter((task) => task.folderId === folder.id).length > 0 && (
              <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
                <div className={`h-2 w-2 rounded-full ${folder.color}`}></div>
                <span>{folder.name}</span>
              </div>
            )}

            {tasks
              .filter((task) => task.folderId === folder.id)
              .map((task) => (
                <div
                  key={task._id}
                  className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-2 task-item ${
                    task.completed ? "opacity-70" : ""
                  }`}
                  onClick={() => {
                    if (editingTaskId !== task._id) {
                      setSelectedTaskId(task._id);
                    }
                  }}
                >
                  {editingTaskId === task._id ? (
                    <form
                      onSubmit={handleEditTask}
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500 bg-white dark:bg-slate-900"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </form>
                  ) : (
                    <div>
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(task);
                          }}
                          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors ${
                            task.completed
                              ? "bg-violet-600 dark:bg-violet-700 border-violet-600 dark:border-violet-700"
                              : "border-gray-300 dark:border-gray-600 hover:border-violet-500 dark:hover:border-violet-500"
                          }`}
                        >
                          {task.completed && (
                            <CheckIcon className="h-3 w-3 text-white" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-gray-800 dark:text-gray-200 ${
                              task.completed
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          {hasTaskMeta(task) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.labels && task.labels.length > 0 &&
                                task.labels.map((label, index) => (
                                  <div
                                    key={`${label}-${index}`}
                                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full"
                                  >
                                    <TagIcon className="h-3 w-3" />
                                    <span>{label}</span>
                                  </div>
                                ))}

                              {task.dueDate && (
                                <div
                                  className={`flex items-center gap-1 text-xs ${getDueDateClass(
                                    task.dueDate
                                  )}`}
                                >
                                  <CalendarIcon className="h-3 w-3" />
                                  <span>{formatDate(task.dueDate)}</span>
                                </div>
                              )}

                              {task.priority !== "none" && (
                                <div
                                  className={`flex items-center gap-1 text-xs ${getPriorityColor(
                                    task.priority
                                  )}`}
                                >
                                  <FlagIcon className="h-3 w-3" />
                                  <span>{task.priority}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTask(task);
                            }}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task._id);
                            }}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckIcon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {showAddTask
              ? "Get started by adding a new task using the 'Add Task' button above."
              : "There are no tasks matching your current filter."}
          </p>
        </div>
      )}

      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
