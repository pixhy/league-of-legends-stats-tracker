import "./App.css";
import { useState, useEffect} from "react";
import { useOutletContext } from 'react-router-dom';
import User from "./components/User";

import { useParams } from 'react-router-dom';

function App() {

const [currentUser, setCurrentUser, nameWithTagLine, setNameWithTagLine] = useOutletContext()
const { gameName, tagLine } = useParams();
useEffect(() => {
  setNameWithTagLine({name: gameName, tagLine: tagLine});
}, [])

useEffect(() => {
  async function fetchUserFromLiveServer() {
    try {
      const response = await fetch(
        `/api/users/?name=${nameWithTagLine.name}&tagLine=${nameWithTagLine.tagLine}`
      );
      const user = await response.json();
      if (response.status === 404) {
        console.log("404 error");
      } else if (response.status === 200) {
        setCurrentUser(user);
      } else if (response.status === 500) {
        console.log("500 error");
      }
    } catch (error) {
      console.log("Some error lel kek: ", error);
    }
  }
  if (nameWithTagLine.name.length > 0 && nameWithTagLine.tagLine.length > 0) {
    fetchUserFromLiveServer();
  }
}, [nameWithTagLine]);

  return (
    <>

      {currentUser ? (
        <>
          <User
            profile={currentUser}
            setCurrentUser={setCurrentUser}
            setNameWithTagLine={setNameWithTagLine}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
