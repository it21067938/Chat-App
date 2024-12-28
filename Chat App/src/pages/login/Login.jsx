import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  return (
    <div className="login">
      <img className="logo" src={assets.logo} alt="" />
      <form className="login-form">
        <h2>{currentState === "Sign Up" ? "Sign Up" : "Login"}</h2>
        {currentState === "Sign Up" ? (
          <>
            <input
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
          type="email"
          placeholder="Enter Your Email"
          className="form-input"
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          className="form-input"
        />
        <button type="submit">
          {currentState === "Sign Up" ? "Sign Up" : "Login"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        {currentState === "Sign Up" ? (
          <div className="login-forgot">
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          </div>
        ) : (
          <div className="login-forgot">
            <p className="login-toggle">
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
