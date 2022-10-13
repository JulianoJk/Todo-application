import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTaskDispatch } from "../../../context/TaskContext";
import { useUserDispatch, useUserState } from "../../../context/UserContext";
import styles from "./Navigation.module.css";
import { useEffect } from "react";
import { Logout, Home, User, Login, Pencil } from "tabler-icons-react";
import { Button, Group, Header } from "@mantine/core";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  let userIsLoggedInLocal = localStorage.getItem("user");

  // Dispatch for the user
  const userDispatch = useUserDispatch();
  // Dispatch for the tasks
  const todoDispatch = useTaskDispatch();

  const { user } = useUserState();

  useEffect(() => {
    // After refresh, restore user's data to be logged
    if (user.token === undefined && userIsLoggedInLocal !== null) {
      userDispatch({ type: "SET_USER", user: JSON.parse(userIsLoggedInLocal) });
    }
  }, [user]);

  // After logout, clear the context for the user and tasks, then navigate to index
  const logOut = () => {
    userDispatch({ type: "RESET_STATE" });
    todoDispatch({ type: "RESET_STATE" });
    navigate("/");
  };

  // Check if is user is logged or not
  if (userIsLoggedInLocal) {
    return (
      <Header
        height={70}
        p="md"
        classNames={{
          root: `${styles.bg}`,
        }}
      >
        <Group position="right">
          <Button
            component={Link}
            to="/home"
            radius="md"
            size="md"
            leftIcon={<Home size={16} />}
            uppercase
          >
            Home
          </Button>

          <Button
            leftIcon={<User size={16} />}
            radius="md"
            size="md"
            uppercase
            color="yellow"
            m={1}
            component={Link}
            to="/profile"
          >
            Profile
          </Button>
          <Button
            leftIcon={<Logout size={16} />}
            radius="md"
            color="red"
            size="md"
            uppercase
            component={Link}
            to="/"
            m={1}
            onClick={logOut}
          >
            logOut
          </Button>
        </Group>
      </Header>
    );
  } else {
    return (
      <Header
        height={70}
        p="md"
        classNames={{
          root: `${styles.bg}`,
        }}
      >
        <Group position="right">
          <Button component={Link} to="/" radius="md" size="md" uppercase>
            Index
          </Button>

          <Button
            leftIcon={<Login size={16} />}
            radius="md"
            size="md"
            uppercase
            color="green"
            variant="outline"
            m={1}
            component={Link}
            to="/login"
          >
            Log-In
          </Button>
          <Button
            leftIcon={<Pencil size={16} />}
            radius="md"
            size="md"
            uppercase
            component={Link}
            to="/register"
            color="green"
            m={1}
          >
            Register
          </Button>
        </Group>
      </Header>
    );
  }
};
export default Navigation;
