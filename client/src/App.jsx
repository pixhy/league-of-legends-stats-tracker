import "./App.css";
import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import User from "./components/User";
import Login from "./components/Login";
import { Link } from "react-router-dom";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [nameWithTagLine, setNameWithTagLine] = useState({
    name: "",
    tagLine: "",
  });
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    if (isLoggedIn && storedUsername) {
      setLogged(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLoginClick = () => {
    if (logged) {
      setLogged(false);
      setUsername("");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
    } else {
      setShowLogin(true);
    }
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  useEffect(() => {
    async function fetchUserFromLiveServer() {
      try {
        const response = await fetch(
          `/api/users/?name=${nameWithTagLine.name}&tagLine=${nameWithTagLine.tagLine}`
        );
        const user = await response.json();
        console.log("user", user);
        if (response.status === 404) {
          console.log("404 error");
          setError(true);
        } else if (response.status === 200) {
          setError(false);
          setCurrentUser(user);
        } else if (response.status === 500) {
          console.log("500 error");
        }
      } catch (error) {
        console.log("Some error lel kek: ", error);
      }
    }
    if (nameWithTagLine.name.length > 0 && nameWithTagLine.tagLine.length > 0) {
      fetchUserFromLiveServer();
    }
  }, [nameWithTagLine]);

  return (
    <>
      <div>
        <button onClick={handleLoginClick}>
          {logged ? "Logout" : "Login"}
        </button>{" "}
        {logged && (
          <span>
            Welcome, {username}! <Link to={"user-profile"}>Profile</Link>
          </span>
        )}
      </div>
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <Login
              setShowLogin={setShowLogin}
              setLogged={setLogged}
              setUsername={setUsername}
            />
          </div>
        </div>
      )}
      <SearchBar
        setCurrentUser={setCurrentUser}
        setNameWithTagLine={setNameWithTagLine}
        setError={setError}
      />
      {!error && currentUser ? (
        <>
          <User profile={currentUser} setCurrentUser={setCurrentUser} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
