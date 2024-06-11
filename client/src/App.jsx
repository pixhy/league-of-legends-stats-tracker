import './App.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import User from './components/User';
import Login from './components/Login';

function App() {
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState('europe');
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState(""); 
  const FetchStates = {submitted, setSubmitted, name, setName, tagLine, setTagLine, region, setRegion}

  const handleLoginClick = () => {
    if (logged) {
      setLogged(false);
      setUsername("");
    } else {
      setShowLogin(true);
    }
  };

  const closeModal = () => {
    setShowLogin(false);
  };

  return (
    <>
    <div>
        <button onClick={handleLoginClick}>
          {logged ? "Logout" : "Login"}
        </button>
        {" "}{logged && <span>Welcome, {username}!</span>}
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
      <SearchBar searchedUser={searchedUser} setSearchedUser={setSearchedUser} states={FetchStates}  setError={setError}/>
      {!error && searchedUser ? (
        <>
          <User profile={searchedUser} />
        </>
      ) : (
        <div className='emptyHistory'>No search results for {`${name}`} in the Europe Nordic & East region.</div>
      )}
    </>
  );
}

export default App;
