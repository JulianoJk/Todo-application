import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTaskDispatch } from "../../../context/TaskContext";
import { useUserDispatch } from "../../../context/UserContext";
import {
  ITasks,
  IUserInfoContext,
  usersDispatchContext,
} from "../../../Model/models";
import { getTasks, loginAPI } from "../../../API/Api";
import Logo from "../../../images/logo.png";
import "../Auth.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import {
  PasswordInput,
  Group,
  Button,
  Box,
  TextInput,
  Center,
  Image,
  Anchor,
} from "@mantine/core";
import { AlertComponent } from "../../AlertComponent/AlertComponent";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setTodoDispatch = useTaskDispatch();
  const userDispatch: usersDispatchContext = useUserDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(undefined);

    try {
      const result = await loginAPI(email, password);

      if (typeof result === "string") {
        setErrorMessage(result);
        return;
      }

      if (!result) return;

      const user: IUserInfoContext = {
        id: result.id,
        username: result.username,
        token: result.token,
      };

      userDispatch({ type: "SET_USER", user });

      const tasks = await getTasks(user, setTodoDispatch);

      tasks?.forEach((task) => {
        setTodoDispatch({
          type: "SET_TASKS_FROM_SERVER",
          payload: {
            name: task.name,
            taskID: task._id,
            completed: task.completed,
          },
        });
      });

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 540 }} mx="auto" className="border">
      <Center>
        <Image radius="md" src={Logo} alt="Logo" />
      </Center>
      <h1 className="title">Log-In</h1>
      <form onSubmit={handleLogin}>
        <TextInput
          required
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          autoComplete="on"
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          autoComplete="on"
        />

        <Group position="right" mt="md">
          <Button color="green" type="submit">
            Submit
          </Button>
        </Group>

        <AlertComponent
          className={ErrorHandler(errorMessage)}
          message={errorMessage}
        />
      </form>

      <Anchor component={Link} to="/register">
        <em>
          <u>Not a member?</u>
        </em>
      </Anchor>
    </Box>
  );
};

export default Login;
