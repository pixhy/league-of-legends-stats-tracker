import { Suspense, useEffect, useState } from 'react';

const SearchBar = ({ searchedUser, setSearchedUser, states, setError }) => {
  const [firstSubmit, setFirstSubmit] = useState(false);
  const [gameName, setGameName] = useState('');
  const [searchedUsers, setSearchedUsers] = useState(null);
  const [riotSubmit, setRiotSubmit] = useState(false);
  const [firstRiotSubmit, setFirstRiotSubmit] = useState(true)

  useEffect(() => {
    if (!firstSubmit) {
      setFirstSubmit(true);
      return;
    }

    async function fetchUserFromDB() {
      // setRiotSubmit(false);
      if (gameName.length > 2) {
        try {
          const response = await fetch(`/api/users/${gameName}`);
          if (response.status === 404) {
            console.log('User not found in DB, fetching from live server...');
           //fetchUserFromLiveServer();
          } else {
            const user = await response.json();
            setSearchedUsers(user);
            return;
          }
        } catch (error) {
          console.log('Error fetching from DB:', error);
          //fetchUserFromLiveServer();
        }
      } else {
        setSearchedUsers(null);
      }
    }

    

    // if (riotSubmit) {
    //   fetchUserFromLiveServer();
    // } else {
    // }
  fetchUserFromDB();
  }, [firstSubmit, gameName]);

  useEffect(() => {
    if(firstRiotSubmit) {
      setFirstRiotSubmit(false)
      return
    }

    async function fetchUserFromLiveServer() {
      try {
        const response = await fetch('/api/userFromRiot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: states.name, tagLine: states.tagLine }),
        });
        const user = await response.json();
        console.log('user', user);
        if (response.status === 404) {
          console.log('404 error');
          setError(true);
        } else if (response.status === 200) {
          setError(false);
          setSearchedUser(user);
        } else if (response.status === 500) {
          console.log('500 error');
        }
        console.log('searchedUser', searchedUser, 'object:', user.puuid);
      } catch (error) {
        console.log('Some error lel kek: ', error);
      }
    }
    fetchUserFromLiveServer();
  }, [riotSubmit])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('form', e.target[1].value);
    setFirstRiotSubmit(false)
    states.setSubmitted((prev) => !prev);
    separateUserNameAndTag(e.target[1].value);
    setRiotSubmit(prev => !prev)
  };

  const handleSummonerClick = (user) => {
    setSearchedUser(user);
    setGameName('');
  };

  function separateUserNameAndTag(name) {
    if (name.includes('#')) {
      let gameName = name.split('#')[0];
      let tagLine = name.split('#')[1].toLowerCase();
      states.setName(gameName);
      states.setTagLine(tagLine);
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
        <select className="cl" onChange={(e) => states.setRegion(e.target.value)}>
          <option value="europe">EUNE</option>
        </select>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Game Name + #EUNE"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Submit</button>
      </form>
      {gameName ? (
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
              : ''}
          </tbody>
        </table>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBar;
