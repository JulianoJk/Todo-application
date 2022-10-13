import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useTaskDispatch } from "../../../context/TaskContext";
import {
  ITasks,
  IUserInfoContext,
  usersDispatchContext,
} from "../../../Model/models";
import { getTasks, loginAPI } from "../../../API/Api";
import Logo from "../../../images/logo.png";
import "../Auth.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Link } from "react-router-dom";
import { useUserDispatch } from "../../../context/UserContext";
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
  const navigate: NavigateFunction = useNavigate();

  const [errorMessage, setErrorMessage] = useState<any>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // After logIn create get request to get (if any) tasks
  const setTodoDispatch = useTaskDispatch();
  const userDispatch: usersDispatchContext = useUserDispatch();

  // Email handler
  const onEmailChange = (e: React.BaseSyntheticEvent): void => {
    setEmail(e.target.value);
  };
  // Password handler
  const onPasswordChange = (e: React.BaseSyntheticEvent): void => {
    setPassword(e.target.value);
  };

  const handleInputs = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const data: string | IUserInfoContext | null | undefined = await loginAPI(
        email,
        password
      );

      // Check the type of the data is returned, if is string, it contains a message which means error and display error
      // If data is not string, it contains user's information (token, id, email) and the login was successful
      if (typeof data === "string" || data instanceof String) {
        setErrorMessage(data);
      } else if (data) {
        const user: IUserInfoContext = {
          id: data["id"],
          username: data["username"],
          token: data["token"],
        };
        userDispatch({ type: "SET_USER", user: user });

        //Get if any tasks from server
        const savedTasks: ITasks[] | null | undefined = await getTasks(
          user,
          setTodoDispatch
        );
        if (savedTasks !== null && savedTasks !== undefined) {
          for (let i = 0; i < savedTasks.length; i++) {
            let taskResponse: ITasks = {
              taskName: savedTasks[i]["taskName"],
              taskID: savedTasks[i]["_id"],
              completed: savedTasks[i]["completed"],
            };
            setTodoDispatch({
              type: "SET_TASKS_FROM_SERVER",
              payload: taskResponse,
            });
          }
          navigate("/home");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 540 }} mx="auto" className="border">
      <Center>
        <Image radius="md" src={Logo} alt="Logo" />
      </Center>
      <h1 className="title">Log-In</h1>
      <form
        // values: current form values
        onSubmit={handleInputs}
      >
        <TextInput
          required
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={onEmailChange}
          autoComplete="on"
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Password"
          value={password}
          onChange={onPasswordChange}
          autoComplete="on"
        />
        <Group position="right" mt="md">
          <Button color="green" type="submit">
            Submit
          </Button>
        </Group>

        {/*Display error message if any*/}
        <AlertComponent
          className={ErrorHandler(errorMessage)}
          message={errorMessage}
        />
      </form>
      <Anchor component={Link} to="/register">
        <em>
          <u> Not a member?</u>
        </em>
      </Anchor>
    </Box>
  );
};
export default Login;
