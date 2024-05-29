import './App.css';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import MatchHistory from './components/MatchHistory';

function App() {
  const [searchedUser, setSearchedUser] = useState(null);

  return (
    <>
      <SearchBar searchedUser={searchedUser} setSearchedUser={setSearchedUser}/>
      <MatchHistory matchHistory={searchedUser}/>
    </>
  );
}

export default App;
