import { ITasks, IUserInfoContext, taskDispatchContext } from "../Model/models";

// API call to use when user wants to login
export const loginAPI = async (
  email: string,
  password: string
): Promise<IUserInfoContext | string | undefined> => {
  try {
    const response = await fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data: IUserInfoContext = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data.message;
    }
  } catch (error) {
    return;
  }
};

// API call to use when user wants to register
export const registerAPI = async (
  email: string,
  username: string,
  password: string,
  passwordRepeat: string
): Promise<IUserInfoContext | string | null | undefined> => {
  try {
    const response = await fetch("http://localhost:3001/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        passwordRepeat: passwordRepeat,
      }),
    });
    const data: IUserInfoContext = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data.message;
    }
  } catch (error) {
    return null;
  }
};

// Return tasks to server
export const submitTasks = async (
  user: IUserInfoContext,
  taskName: string
): Promise<ITasks | string | undefined> => {
  try {
    const response = await fetch(`http://localhost:3001/tasks/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },

      body: JSON.stringify({
        // return to the server the tasks object
        taskName,
        user,
      }),
    });
    console.log("Tasks sended!");
    const data: ITasks = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data.error;
    }
  } catch (error) {
    return;
  }
};

// After login, retrieve (if any) saved tasks from the server
// get the tasks from the server and push to array
export const getTasks = async (
  user: IUserInfoContext,
  setTodoDispatch: taskDispatchContext
): Promise<ITasks[] | null | undefined> => {
  try {
    const response = await fetch(`http://localhost:3001/tasks/get/${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },
    });
    const data: ITasks[] = await response.json();
    if (response.status === 203) {
      return null;
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteTasks = async (
  user: IUserInfoContext,
  taskID: string | undefined
): Promise<void> => {
  try {
    await fetch(`http://localhost:3001/tasks/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },
      body: JSON.stringify({
        taskID: taskID,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTasks = async (
  user: IUserInfoContext,
  taskID: string | undefined,
  completedStatus: boolean | undefined
): Promise<void> => {
  try {
    await fetch(`http://localhost:3001/tasks/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },
      body: JSON.stringify({
        taskID: taskID,
        completed: completedStatus,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

export const editTasks = async (
  user: IUserInfoContext,
  taskID: string,
  editTodo: string
): Promise<ITasks | string | undefined> => {
  try {
    const response = await fetch(`http://localhost:3001/tasks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },
      body: JSON.stringify({
        taskID: taskID,
        editTodo: editTodo,
      }),
    });
    const data: ITasks = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data.error;
    }
  } catch (error) {
    console.log(error);
  }
};
