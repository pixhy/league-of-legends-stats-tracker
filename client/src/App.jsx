import './App.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import MatchHistory from './components/MatchHistory';
import User from './components/User';

function App() {
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState('europe');
  const [error, setError] = useState(false);
  const FetchStates = {submitted, setSubmitted, name, setName, tagLine, setTagLine, region, setRegion}

  return (
    <>
      <SearchBar searchedUser={searchedUser} setSearchedUser={setSearchedUser} states={FetchStates} setError={setError}/>
      {!error && searchedUser ? (
        <>
          <User profile={searchedUser} />
          <MatchHistory matchHistory={searchedUser} states={FetchStates} setSearchedUser={setSearchedUser}/>
        </>
      ) : (
        <div className='emptyHistory'>No search results for {`${name}`} in the Europe Nordic & East region.</div>
      )}
    </>
  );
}

export default App;
