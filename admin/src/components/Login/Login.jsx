import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ setToken, url }) => {

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onLogin = async (event) => {

    event.preventDefault();

    try {

      const response = await axios.post(
        `${url}/api/user/login`,
        data
      );

      if (response.data.success) {

        localStorage.setItem(
          "token",
          response.data.token
        );

        setToken(response.data.token);

        toast.success("Login Successfully");

      } else {

        toast.error(response.data.message);
      }

    } catch (error) {

      console.log(error);

      toast.error("Error");
    }
  };

  return (
    <div className="login">

      <form
        onSubmit={onLogin}
        className="login-container"
      >

        <div className="login-title">
          <h2>Login</h2>
        </div>

        <div className="login-inputs">

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />

        </div>

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
};

export default Login;