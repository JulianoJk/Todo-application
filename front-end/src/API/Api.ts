import { ITasks, IUserInfoContext, taskDispatchContext } from "../Model/models";

// API call to use when user wants to login
export const loginAPI = async (
  email: string,
  password: string
): Promise<IUserInfoContext | string | undefined> => {
  try {
    const response = await fetch("http://localhost:5050/api/users/login", {
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
    const response = await fetch("http://localhost:5050/api/users/register", {
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
  name: string
): Promise<ITasks | string | undefined> => {
  try {
    console.log("User submitting task:", user);

    const response = await fetch(`http://localhost:5050/api/tasks/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${user.token}`,
      },
      body: JSON.stringify({
        name: name,
        user_id: user.id, // or user._id depending on your backend
      }),
    });

    const data: ITasks = await response.json();
    if (response.ok) {
      return data;
    } else {
      return data.error;
    }
  } catch (error) {
    console.log("Error submitting task:", error);
  }
};


// After login, retrieve (if any) saved tasks from the server
// get the tasks from the server and push to array
export const getTasks = async (
  user: IUserInfoContext,
  setTodoDispatch: taskDispatchContext
): Promise<ITasks[] | null | undefined> => {
  try {
    const response = await fetch(
      `http://localhost:5050/api/tasks/get/${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${user.token}`,
        },
      }
    );
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
    await fetch(`http://localhost:5050/api/tasks/delete`, {
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
    await fetch(`http://localhost:5050/api/tasks/update`, {
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
    const response = await fetch(`http://localhost:5050/api/tasks/edit`, {
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
