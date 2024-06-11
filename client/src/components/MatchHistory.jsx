import { useEffect, useState } from 'react';
import Match from './Match';
import Loading from './Loading/Loading';

const MatchHistory = ({ matchHistory, loading, profile }) => {
  console.log('matchHistory', matchHistory);
  console.log(matchHistory[0].metadata.matchId)
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {matchHistory.length > 0 ? (
        <>
          <div>
            {matchHistory.map((match) => (
              <Match key={match.metadata.matchId} match={match} profile={profile} loading={loading}/>
            ))}
          </div>
        </>
      ) : (
        <div className="emptyHistory">There are no results recorded.</div>
      )}
    </>
  );
};

export default MatchHistory;
