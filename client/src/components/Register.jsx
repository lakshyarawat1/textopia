import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
   const { setId, setUserName:setLoggedInUserName } = useContext(UserContext);

  async function register(e) {
    e.preventDefault();
    const { data } = await axios.post("/register", { userName, password });
    setLoggedInUserName(userName);
    setId(data.id);
  }

  return (
    <div>
      <div className="bg-blue-50 h-screen flex items-center">
        <form className="w-64 mx-auto" onSubmit={register}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            className="block w-full rounded-md p-2 mb-2"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="block w-full rounded-md p-2 mb-2"
          />
          <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
