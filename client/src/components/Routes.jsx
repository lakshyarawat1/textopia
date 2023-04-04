import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";

export default function Routes() {
  const { userName, id } = useContext(UserContext);
  if (userName) {
    return "Logged In" + userName;
  }
  return <Register />;
}
