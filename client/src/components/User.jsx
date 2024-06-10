import { useEffect, useState } from 'react';
import MatchHistory from './MatchHistory';

const User = ({ profile }) => {
  const [matchHistory, setMatchHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  // const user = profile.profileData;
  // const rank = profile.rankedDataAll[0].tier ? profile.rankedDataAll[0] : profile.rankedDataAll[1];
  // if (profile.message) {
  //   return <div className="profileError">{profile.message}</div>;
  // }

  // console.log("profile.rankedDataAll[0]: ",profile.rankedDataAll[0]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      console.log(profile.puuid);
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ puuid: profile.puuid }),
      });
      const history = await response.json();
      console.log('history', history);
      setMatchHistory(history);
      setLoading(false);
    };
    fetchMatchHistory();
  }, [profile]);

  return (
    <div>
      <div className="userData">
        <div className="iconAndLevel">
          <span className="summonerLevel">{profile.summonerLevel}</span>
          <img className="summonerIcon" src={`/profileicon/${profile.profileIconId}.png`} alt="profileicon" />
        </div>
        <div className="summonerName">
          {profile.gameName} #{profile.tagLine}
        </div>
        {!profile.rank ? (
          <img src="/tier/UNRANKED.png" alt="" />
        ) : (
          <div className="division">
            <div className="tierImg">
              <img src={`/tier/${profile.tier}.png`} alt={profile.tier} />
            </div>
            <div className="rankData">
              <div className="tierAndLp">
                <span className="Lp">{profile.leaguePoints}LP </span>
                <span className="tier">{profile.tier} </span>
                <span className="rank">{profile.rank}</span>
              </div>
              <div className="winLose">
                <span className="win">{profile.wins}W </span>
                <span className="lose">{profile.losses}L</span>
              </div>
              <span className="winrate">Win Rate {((profile.wins / (profile.wins + profile.losses)) * 100).toFixed(0)} %</span>
            </div>
          </div>
        )}
      </div>
      {!loading ? <MatchHistory matchHistory={matchHistory} loading={loading} /> : ''}
    </div>
  );
};

export default User;
