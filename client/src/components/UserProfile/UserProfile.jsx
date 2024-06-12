import { Link, Outlet } from "react-router-dom";
const UserProfile = () => {
  const handleDeleteProfile = async () => {
    const resp = await fetch("/api/delete-profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: localStorage.getItem("username") }),
    });
    if (resp.ok) {
      alert("Profile deleted successfully");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      window.location.href = "/";
    } else {
      alert("Failed to delete profile");
    }
  };
  return (
    <>
      <div className="banner">
        <Link to={"/"}>
          <img src="banner.png" alt="" />
        </Link>
      </div>
      <div className="buttons">
        <Link to="favorites">Favorites</Link>
      </div>
      <div>
        <h2>Change Password</h2>
        <input type="password" placeholder="Current" />
        <input type="password" placeholder="New Password" />
      </div>
      <div>
        <h2>Delete Profile</h2>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
      </div>
      <Outlet />
    </>
  );
};

export default UserProfile;
