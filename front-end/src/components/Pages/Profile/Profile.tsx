import { useUserState } from "../../../context/UserContext";
import URLError from "../URLError/URLError";

const Profile: React.FC = () => {
  const { user } = useUserState();
  let userIsLoggedInLocal = localStorage.getItem("user");

  if (userIsLoggedInLocal) {
    return (
      <div>
        <h1> Welcome Back {user.username}! </h1>
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
export default Profile;
