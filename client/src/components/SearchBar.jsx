import { useEffect, useState } from 'react';
const SearchBar = ({searchedUser, setSearchedUser, states, setError}) => {

  // let message = useRef(null)
  const [firstSubmit, setFirstSubmit] = useState(false);
  const [gameName, setGameName] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(null);
  
  useEffect(() => {
    if(!firstSubmit) return;
    // console.log("name",states.name)
    // console.log("tagLine",states.tagLine)
    // console.log("region",states.region)

    // const fetchUser = async () => {
    //   try {
        
    //     const response = await fetch('/api/userFromRiot', {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({region: states.region, name: states.name, tagLine: states.tagLine})
    //     });
    //     const user = await response.json();
    //     if (response.status === 404) {
    //       console.log("404error")
    //       setError(true)
    //     } else if (response.status === 200){
    //       setError(false)
    //       setSearchedUser(user);
    //     } else if (response.status === 500){
    //       console.log("500error")
    //     }
    //     console.log('searchedUser', searchedUser,"object:" ,user.puuid);
    //     // setSubmitted(false)
    //   } catch (error) {
    //     console.log('Some error lel kek: ', error);
    //   }
    // };
    // fetchUser();

    

  }, [states.submitted, firstSubmit, gameName]);

  useEffect(() => {
    if(!firstSubmit){
      setFirstSubmit(true);
      return;
    } 

    const fetchUserFromDB = async () =>{
      if (gameName.length > 2){
        const response = await fetch(`/api/users/${gameName}`);
        const user = await response.json();
        setSearchedUsers(user);
      }
    };
    fetchUserFromDB()
  }, [gameName, searchedUser])


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form", e.target[1].value)
    setFirstSubmit(true);
    states.setSubmitted(prev => !prev)
    separateUserNameAndTag(e.target[1].value)
  }

  function separateUserNameAndTag(name){
    if(name.includes("#")){
      let gameName = name.split("#")[0]
      let tagLine = name.split("#")[1].toLowerCase()
      states.setName(gameName)
      states.setTagLine(tagLine)
    } else{
      console.log("Enter correct username!")
    }
  }
  
  const handleSummonerClick = (user) =>{
    console.log(user)
    setSearchedUser(user)
    setGameName("");
    console.log(searchedUser)
  }

  return (
    <div className='searchContainer'>
    <img src="banner.png" className="banner" alt="" />
    <form onSubmit={handleSubmit}>
      <select className='cl' onChange={(e) => states.setRegion(e.target.value)}>
        <option value="europe">EUNE</option>
      </select>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" placeholder="Game Name + #EUNE" value={gameName} onChange={(e) => setGameName(e.target.value)} autoComplete='off'/>
      <button type='submit'>Submit</button>
    </form>
      {gameName ? 
      <table><tbody>{searchedUsers ? searchedUsers.map(user => <tr key={user._id}><td onClick={() => handleSummonerClick(user)}>{user.gameName}#{user.tagLine}</td></tr>) : ""}</tbody></table> 
      : ""}

    </div>
  )
}

export default SearchBar