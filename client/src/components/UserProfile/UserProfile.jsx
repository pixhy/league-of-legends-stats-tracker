import { Link, Outlet } from 'react-router-dom';
const UserProfile = () => {
  const userName = localStorage.getItem('username');
  
  return (
    <>
      <div className="banner">
        <Link to={'/'}>
          <img src="/banner.png" alt="" />
        </Link>
      </div>
      <div className="buttons">
        <Link to="user-favorites" className="link-buttons">
          <button>Favorites</button>
        </Link>
        <Link to="edit" className='link-button'>
          <button>Edit profile</button>
        </Link>
      </div>

      
      <Outlet context={userName} />
    </>
  );
};

export default UserProfile;
