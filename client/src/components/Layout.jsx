import Login from './Login';
import { Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";

const Layout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [nameWithTagLine, setNameWithTagLine] = useState({
    name: "",
    tagLine: "",
  });


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    if (isLoggedIn && storedUsername) {
      setLogged(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLoginClick = () => {
    if (logged) {
      setLogged(false);
      setUsername('');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
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
        {logged && (
          <span>
            Welcome, {username}! <button> <Link className='link-buttons' to={'user-profile'}>Profile</Link></button>
          </span>
        )}
        <button onClick={handleLoginClick}>{logged ? 'Logout' : 'Login'}</button>
      </div>
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <Login setShowLogin={setShowLogin} setLogged={setLogged} setUsername={setUsername} />
          </div>
        </div>
      )}
      <div className="banner">
        <Link to="/" onClick={() => setCurrentUser(null)}>
          <img src="/banner.png" alt="" />
        </Link>
      </div>
      <div>
        <SearchBar
          setCurrentUser={setCurrentUser}
          setNameWithTagLine={setNameWithTagLine}
          nameWithTagLine={nameWithTagLine}
          
        />
      </div>

      <Outlet context={[currentUser, setCurrentUser, nameWithTagLine, setNameWithTagLine]}/>
    </>
  );
};

export default Layout;
