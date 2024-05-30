import { useEffect } from 'react';
import Match from './Match';

const MatchHistory = ({ matchHistory, states , setSearchedUser}) => {
  console.log('matchHistory', matchHistory);
  // const [matchData, setMatchData] = useEffect(null)
  useEffect(() => {
    // console.log("matchHistory in useEffect: ", matchHistory)
    // setMatchData(matchHistory)
  }, [matchHistory]);

  console.log("matches: ",matchHistory.matches)
  return (
    <>
      {matchHistory.matches.length > 0 ? (
        <>
          <div>
            {matchHistory.matches.map((match, i) => (
              <Match match={match} key={i} states={states} setSearchedUser={setSearchedUser}/>
            ))}
          </div>
        </>
      ) : (
        <div className='emptyHistory'>There are no results recorded.</div>
      )}
    </>
  );
};

export default MatchHistory;
