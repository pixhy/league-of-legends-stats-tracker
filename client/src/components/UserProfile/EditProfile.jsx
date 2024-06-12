import { useState } from 'react';
const EditProfile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('')

const handleChangePassword = async () => {
const resp = await fetch('/api/change-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: localStorage.getItem('username'),
    currentPassword,
    newPassword,
  })
});
if (resp.ok){
  alert('Password successfully changed 🫡')
  setCurrentPassword('');
  setNewPassword('');
}else {
  alert('not good, not good at all...');
}
}

  const handleDeleteProfile = async () => {
    const resp = await fetch('/api/delete-profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: localStorage.getItem('username') }),
    });
    if (resp.ok) {
      alert('Profile deleted successfully');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      window.location.href = '/';
    } else {
      alert('Failed to delete profile');
    }
  };
  return (
    
    <>
      <div>
        <h2>Change Password</h2>
        <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
      <div>
        <h2>Delete Profile</h2>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
      </div>
    </>
  )
}

export default EditProfile
