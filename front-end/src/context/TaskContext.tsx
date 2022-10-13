import React, { useContext, useReducer } from "react";
import {
  TodoAction,
  ITasks,
  taskDispatchContext,
  IChildrenProvider,
} from "../Model/models";

const defaultTaskState: Array<ITasks> = [
  {
    taskName: undefined,
    taskID: undefined,
    completed: undefined,
  },
];

// Reducer function for the tasks
const taskReducer = (state: Array<ITasks>, action: TodoAction) => {
  switch (action.type) {
    case "ADD_TASK":
      // save new task
      const newTodo = (
        taskName: string | undefined,
        _id: string | undefined,
        completed: boolean | undefined
      ): ITasks => {
        return { taskName: taskName, taskID: _id, completed: completed };
      };

      // Add the tasks to the array
      return [
        ...state,
        newTodo(
          action.payload.taskName,
          action.payload.taskID,
          action.payload.completed
        ),
      ];
    case "UPDATE_TASK":
      return state.map((todo) => {
        if (todo.taskID === action.payload.taskID) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    case "DELETE_TASK":
      return state.filter((todo) => todo.taskID !== action.payload.taskID);
    case "SET_TASKS_FROM_SERVER":
      return [...state, action.payload];
    case "EDIT_TASK":
      // map all the tasks, when ids match, change the taskName with the new taskName
      return state.map((todo) => {
        if (todo.taskID === action.payload.taskID) {
          return { ...todo, taskName: action.payload.taskName };
        }
        return todo;
      });
    case "RESET_STATE":
      // After logout, empty the array with tasks from context
      return [];
    default:
      return state;
  }
};

// context for the task dispatch
const TaskDispatchContext = React.createContext<
  taskDispatchContext | undefined
>(undefined);

// Context for the tasks
const TodoArrayContext = React.createContext<ITasks[] | undefined>(undefined);

// Function for the task context provider
const TasksContextProvider = ({ children }: IChildrenProvider) => {
  const [taskState, taskDispatch] = useReducer(taskReducer, defaultTaskState);

  return (
    <TodoArrayContext.Provider value={taskState}>
      <TaskDispatchContext.Provider value={taskDispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TodoArrayContext.Provider>
  );
};

// Pass the state of the user
const useTaskState = () => {
  const context = useContext(TodoArrayContext);
  if (context === undefined) {
    throw new Error("useTaskState must be used within TaskContextProvider");
  }
  return context;
};

// Function to use the userDispatch
const useTaskDispatch = () => {
  const context = useContext(TaskDispatchContext);
  if (context === undefined) {
    throw new Error("useTaskDispatch must be used within TaskContextProvider");
  }
  return context;
};

export { TasksContextProvider, useTaskState, useTaskDispatch };
