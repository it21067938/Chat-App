import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signUp, login, resetPassword } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign Up") {
      signUp(username, email, password);
    }
    if (currentState === "Login") {
      login(email, password);
    }
    if (currentState === "Reset") {
      resetPassword(email);
    }
  };

  return (
    <div className="login">
      <img className="logo" src={assets.logo} alt="" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currentState === "Sign Up" ? "Sign Up" : currentState === "Login" ? "Login" : "Forgot Password"}</h2>
        {currentState === "Sign Up" ? (
          <>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder="Enter Your User Name"
              className="form-input"
              required
            />
          </>
        ) : (
          <></>
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Enter Your Email"
          className="form-input"
        />
        {currentState === "Login" || "Sign up" ? 
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Enter Your Password"
          className="form-input"
        /> : <></>}
        <button type="submit">
          {currentState === "Sign Up" ? "Sign Up" : currentState === "Login" ? "Login" : "Reset"}
        </button>

        {currentState === "Sign Up" ? (
          <>
            <div className="login-term">
              <input type="checkbox" required />
              <p>Agree to the terms of use & privacy policy.</p>
            </div>
            <div className="login-forgot">
              <p className="login-toggle">
                Already have an account{" "}
                <span onClick={() => setCurrentState("Login")}>Login here</span>
              </p>
            </div>
          </>
        ) : (
          <div className="login-forgot">
            <p className="login-toggle">
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
            <p className="login-toggle">
             Forgot Password?
              <span onClick={() => setCurrentState("Reset")}> Reset here</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;