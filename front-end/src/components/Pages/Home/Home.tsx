import React from "react";
import TaskForm from "../../Tasks/TaskForm/TaskForm";
import URLError from "../URLError/URLError";

const Home: React.FC = () => {
  let userIsLoggedInLocal = localStorage.getItem("user");

  if (userIsLoggedInLocal) {
    return (
      <div>
        <TaskForm />
      </div>
    );
  } else {
    return (
      <div>
        <URLError
          navText="No Account found. To proceed, you must be logged-in!"
          navigationPath="/login"
          btnText="Login"
        />
      </div>
    );
  }
};

export default Home;
