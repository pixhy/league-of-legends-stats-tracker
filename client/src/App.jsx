import './App.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import User from './components/User';

function App() {
  const [searchedUser, setSearchedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const FetchStates = {submitted, setSubmitted}

  return (
    <>
      <SearchBar searchedUser={searchedUser} setSearchedUser={setSearchedUser} states={FetchStates}  setError={setError}/>
      {!error && searchedUser ? (
        <>
          <User profile={searchedUser} />
        </>
      ) : (
        <div className='emptyHistory'>No search results for {`${name}`} in the Europe Nordic & East region.</div>
      )}
    </>
  );
}

export default App;
