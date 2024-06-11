import "./App.css";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import User from "./components/User";
import Login from "./components/Login";

function App() {
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const FetchStates = { submitted, setSubmitted };

  const handleLoginClick = () => {
    if (logged) setLogged(false);
    else setShowLogin(true);
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  return (
    <>
      <button onClick={handleLoginClick}>{logged ? "Logout" : "Login"}</button>
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <Login setShowLogin={setShowLogin} setLogged={setLogged} />
          </div>
        </div>
      )}

      <SearchBar
        searchedUser={searchedUser}
        setSearchedUser={setSearchedUser}
        states={FetchStates}
        setError={setError}
      />
      {!error && searchedUser ? (
        <>
          <User profile={searchedUser} />
        </>
      ) : (
        <div className="emptyHistory">
          No search results for {`${name}`} in the Europe Nordic & East region.
        </div>
      )}
    </>
  );
}

export default App;
