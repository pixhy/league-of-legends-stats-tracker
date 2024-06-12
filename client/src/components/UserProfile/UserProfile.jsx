import { Link, Outlet } from 'react-router-dom'
const UserProfile = () => {
  return (
    <>
    <div className='banner'>
      <Link to={"/"}>
        <img src="banner.png"  alt="" />
      </Link>
    </div>
    <div className="buttons">
      <Link to="favorites">Favorites</Link>
    </div>
    <Outlet/>
    </>
  )
}

export default UserProfile
