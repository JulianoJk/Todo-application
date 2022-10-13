import { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EActionTypes,
  IAuthCredentials,
  IUserInfoContext,
  usersDispatchContext,
} from "../../../Model/models";
import { registerAPI } from "../../../API/Api";
import Logo from "../../../images/logo.png";
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

import "../Auth.css";
import { useUserDispatch } from "../../../context/UserContext";

// Initial state for the user credentials
const initState: IAuthCredentials = {
  email: undefined,
  username: undefined,
  password: undefined,
  passwordRepeat: undefined,
};

// Reducer to set credentials for the user
const reducer = (state: IAuthCredentials, action: IAuthCredentials) => {
  switch (action.type) {
    case EActionTypes.SET_EMAIL:
      return { ...state, email: action.email };
    case EActionTypes.SET_NAME:
      return { ...state, username: action.username };
    case EActionTypes.SET_PASSWORD:
      return { ...state, password: action.password };
    case EActionTypes.SET_CONFIRM_PASSWORD:
      return { ...state, passwordRepeat: action.passwordRepeat };
    default:
      return { ...state };
  }
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [internalState, formDispatch] = useReducer(reducer, initState);
  const userDispatch: usersDispatchContext = useUserDispatch();
  const [errorMessage, setErrorMessage] = useState<any>();

  // Email handler
  const onEmailChange = (e: React.BaseSyntheticEvent): void => {
    formDispatch({ type: EActionTypes.SET_EMAIL, email: e.target.value });
  };

  const onNameChange = (e: React.BaseSyntheticEvent): void => {
    formDispatch({ type: EActionTypes.SET_NAME, username: e.target.value });
  };

  const handlePassword = (e: React.BaseSyntheticEvent): void => {
    formDispatch({ type: EActionTypes.SET_PASSWORD, password: e.target.value });
  };

  const handleConfirmPassword = (e: React.BaseSyntheticEvent): void => {
    formDispatch({
      type: EActionTypes.SET_CONFIRM_PASSWORD,
      passwordRepeat: e.target.value,
    });
  };

  const handleInputs = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await registerAPI(
        `${internalState.email}`,
        `${internalState.username}`,
        `${internalState.password}`,
        `${internalState.passwordRepeat}`
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
        navigate("/home");
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
          value={initState.email}
          onChange={onEmailChange}
          autoComplete="on"
        />

        <TextInput
          label="Username"
          placeholder="John Smith"
          value={initState.username}
          onChange={onNameChange}
          autoComplete="on"
        />

        <PasswordInput
          required
          label="Password"
          value={initState.password}
          placeholder="Password"
          onChange={handlePassword}
          autoComplete="on"
        />

        <PasswordInput
          required
          label="Confirm Password"
          placeholder=" Confirm Password"
          value={initState.passwordRepeat}
          onChange={handleConfirmPassword}
          autoComplete="on"
        />
        <Group position="right" mt="md">
          <Button color="green" type="submit">
            Submit
          </Button>
        </Group>
      </form>
      {/*Display error message if any*/}
      <AlertComponent
        className={ErrorHandler(errorMessage)}
        message={errorMessage}
      />
      <Anchor component={Link} to="/register">
        <em>
          <u> Not a member?</u>
        </em>
      </Anchor>
    </Box>
  );
};
export default Register;
