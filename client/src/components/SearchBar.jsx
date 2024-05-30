import { useEffect, useState } from 'react';
const SearchBar = ({searchedUser, setSearchedUser, states, setError}) => {

  // let message = useRef(null)
  const [firstSubmit, setFirstSubmit] = useState(false);
  
  useEffect(() => {
    if(!firstSubmit) return;
    console.log("name",states.name)
    console.log("tagLine",states.tagLine)
    console.log("region",states.region)

    const fetchUser = async () => {
      try {
        
        const response = await fetch('/api/userFromRiot', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({region: states.region, name: states.name, tagLine: states.tagLine})
        });
        const user = await response.json();
        if (response.status === 404) {
          console.log("404error")
          setError(true)
        } else if (response.status === 200){
          setError(false)
          setSearchedUser(user);
        } else if (response.status === 500){
          console.log("500error")
        }
        console.log('searchedUser', searchedUser,"object:" ,user.puuid);
        // setSubmitted(false)
      } catch (error) {
        console.log('Some error lel kek: ', error);
      }
    };
    fetchUser();

  }, [states.submitted, firstSubmit]);

  useEffect(() => {
    if (!firstSubmit) return
    
    console.log("Itt:",searchedUser)
  
  }, [searchedUser])

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

  return (
    <div className='searchContainer'>
    <img src="banner.png" className="banner" alt="" />
    <form onSubmit={handleSubmit}>
      <select className='cl' onChange={(e) => states.setRegion(e.target.value)}>
        <option value="europe">EUNE</option>
      </select>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" placeholder="Game Name + #EUNE"/>
      <button type='submit'>Submit</button>
    </form>
    </div>
  )
}

export default SearchBar