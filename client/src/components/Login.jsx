import { useState, useEffect } from "react";

export default function Login({ setShowLogin, setLogged, setUsername }) {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [newUser, setNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const newUserChangeHandler = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const checkUser = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.username);
        setShowLogin(false);
        setLogged(true);
        setUsername(data.username);
        console.log("Login successful");
      } else {
        setErrorMessage(result.message);
        console.log(result.message);
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Server error, please try again later.");
    }
  };

  const handleRegister = async () => {
    if (newUserData.password !== newUserData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      console.log("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUserData.username,
          password: newUserData.password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", newUserData.username);
        setShowLogin(false);
        setLogged(true);
        setUsername(newUserData.username);
        console.log("User registered successfully");
      } else {
        setErrorMessage(result.message);
        console.log(result.message);
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage("Server error, please try again later.");
    }
  };

  return (
    <>
      <div className="App">
        {newUser ? (
          <div className="register-form">
            <div className="input-text">
              <input
                type="text"
                name="username"
                value={newUserData.username}
                placeholder="Username"
                required
                onChange={newUserChangeHandler}
                autoComplete="off"
              />
            </div>
            <div className="input-text">
              <input
                type="password"
                name="password"
                value={newUserData.password}
                placeholder="Password"
                required
                onChange={newUserChangeHandler}
              />
            </div>
            <div className="input-text">
              <input
                type="password"
                name="confirmPassword"
                value={newUserData.confirmPassword}
                placeholder="Confirm Password"
                required
                onChange={newUserChangeHandler}
              />
            </div>
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => setNewUser(false)}>Back to Login</button>
            {errorMessage && <p className="error fade-out">{errorMessage}</p>}
          </div>
        ) : (
          <div className="login-form">
            <div className="input-text">
              <input
                type="text"
                name="username"
                value={data.username}
                placeholder="Username"
                required
                onChange={changeHandler}
                autoComplete="off"
              />
            </div>
            <div className="input-text">
              <input
                type="password"
                name="password"
                value={data.password}
                placeholder="Password"
                required
                onChange={changeHandler}
              />
            </div>
            <button onClick={checkUser}>Login</button>
            <button onClick={() => setNewUser(true)}>New User</button>
            {errorMessage && <p className="error fade-out">{errorMessage}</p>}
          </div>
        )}
      </div>
    </>
  );
}
