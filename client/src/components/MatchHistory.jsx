import { useEffect } from 'react';
import Match from './Match';

const MatchHistory = ({ matchHistory }) => {
  console.log('matchHistory', matchHistory);
  // const [matchData, setMatchData] = useEffect(null)
  useEffect(() => {
    // console.log("matchHistory in useEffect: ", matchHistory)
    // setMatchData(matchHistory)
  }, [matchHistory]);

  return (
    <>
      {matchHistory ? (
        <>
          <div>
            {matchHistory.map((history, i) => (
              <Match history={history} key={i}/>
            ))}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default MatchHistory;
