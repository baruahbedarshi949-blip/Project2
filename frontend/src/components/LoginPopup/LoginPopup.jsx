
//UpDates PoOPUPS
import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async (event) => {

    event.preventDefault();

    try {

      let newUrl = url;

      if (currentState === "Login") {
        newUrl += "/api/user/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(
        newUrl,
        data
      );

      if (response.data.success) {

        setToken(response.data.token);

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "userId",
          response.data.userId
        );

        localStorage.setItem(
          "role",
          response.data.role
        );

        toast.success("Login Successfully");

        setShowLogin(false);

      } else {

        toast.error(response.data.message);
      }

    } catch (error) {

      console.log(error);

      toast.error("Login Failed");
    }
  };

  return (

    <div className="login-popup">

      <form
        onSubmit={onLogin}
        className="login-popup-container"
      >

        <div className="login-popup-title">

          <h2>{currentState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />

        </div>

        <div className="login-popup-inputs">

          {currentState === "Login" ? null : (

            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

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
            placeholder="Your password"
            required
          />

        </div>

        <button type="submit">

          {currentState === "Sign Up"
            ? "Create Account"
            : "Login"}

        </button>

        <div className="login-popup-condition">

          <input type="checkbox" required />

          <p>
            By continuing, I agree to the
            terms of use & privacy policy.
          </p>

        </div>

        {currentState === "Login" ? (

          <p>
            Create a new account?
            <span
              onClick={() =>
                setCurrentState("Sign Up")
              }
            >
              {" "}
              Click here
            </span>
          </p>

        ) : (

          <p>
            Already have an account?
            <span
              onClick={() =>
                setCurrentState("Login")
              }
            >
              {" "}
              Login here
            </span>
          </p>
        )}

      </form>

    </div>
  );
};

export default LoginPopup;
