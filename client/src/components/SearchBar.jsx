import { useEffect, useState } from 'react';
const SearchBar = () => {
  const [firstSubmit, setFirstSubmit] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [tagLine, setTagLine] = useState('eune');
  const [region, setRegion] = useState('europe');
  useEffect(() => {
    if(!firstSubmit) return;

    const fetchUser = async () => {
      try {
        
        const response = await fetch('/api/userFromRiot', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({region: region, name: name, tagLine: tagLine})
        });

        const user = await response.json();
        setSearchedUser(user);
        console.log('searchedUser', searchedUser,"object:" ,user.puuid);
        // setSubmitted(false)
      } catch (error) {
        console.log('Some error lel kek: ', error);
      }
    };
    fetchUser();

  }, [submitted, firstSubmit]);

  useEffect(() => {
    if (!firstSubmit) return
    
    console.log("Itt:",searchedUser)
  
  }, [searchedUser])

  const handleSubmit = (e) => {
    e.preventDefault();
    setFirstSubmit(true);
    setSubmitted(prev => !prev)

  }

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={(e) => setRegion(e.target.value)}>
        <option value="europe">EUROPE</option>
        <option value="americas">AMERICAS</option>
        <option value="asia">ASIA</option>
      </select>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
      <label htmlFor="tagLine">Tag</label>
      <input type="text" name="tagLine" id="tagLine" placeholder='e.g.:EUNE' value={tagLine} onChange={(e)=> setTagLine(e.target.value.toLowerCase())}/>
      <button type='submit'>Submit</button>
    </form>
  )
}

export default SearchBar