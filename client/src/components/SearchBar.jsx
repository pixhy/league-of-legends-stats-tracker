import { useEffect, useState } from 'react';

const SearchBar = ({ setCurrentUser, setNameWithTagLine }) => {

  const [searchInput, setSearchInput] = useState('');
  const [searchedUsers, setSearchedUsers] = useState(null);

  useEffect(() => {
    async function fetchUserFromDB() {
      console.log("fetchUserFromDB", searchInput);
      try {
        const response = await fetch(`/api/usersearch/${searchInput}`);
        if (response.status === 404) {
          console.log('User not found in DB, fetching from live server...');
        } else {
          const user = await response.json();
          setSearchedUsers(user);
          return;
        }
      } catch (error) {
        console.log('Error fetching from DB:', error);
      }
    }

    if (searchInput.length > 2 && !searchInput.includes("#")){
      fetchUserFromDB();
    } else {
      setSearchedUsers(null);
    }
  }, [searchInput])


  
  const handleSubmit = (e) => {
    e.preventDefault();
    separateUserNameAndTag(searchInput)
  };

  const handleSummonerClick = (user) => {
    setCurrentUser(user);
    setSearchInput('');
  };

  function separateUserNameAndTag(name) {
    if (name.includes('#')) {
      let gameName = name.split('#')[0];
      let tagLine = name.split('#')[1].toLowerCase();
      if(gameName.length<=16 && gameName.length>2 && tagLine.length<=5 && tagLine.length>2){
        setNameWithTagLine({name: gameName, tagLine: tagLine});
      }
    } else {
      console.log('Enter correct username!');
    }
  }

  return (
    <div className="searchContainer">
      <a href="/">
        <img src="banner.png" className="banner" alt="" />
      </a>
      <form onSubmit={handleSubmit}>
        <select className="cl">
          <option value="europe">EUNE</option>
        </select>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Game Name + #EUNE"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Submit</button>
      </form>
      {searchInput ? (
        <table>
          <tbody>
            {searchedUsers
              ? searchedUsers.map((user) => (
                  <tr key={user._id}>
                    <td onClick={() => handleSummonerClick(user)}>
                      <img src={`profileicon/${user.profileIconId}.png`} width="30px" alt={`${user.gameName}#${user.tagLine}`} />
                      {user.gameName}#{user.tagLine}
                    </td>
                  </tr>
                ))
              : (<></>)}
          </tbody>
        </table>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBar;
