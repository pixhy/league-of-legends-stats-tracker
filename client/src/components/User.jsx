import { useEffect, useState } from 'react';
import MatchHistory from './MatchHistory';

const User = ({ setCurrentUser, profile, setNameWithTagLine }) => {
  const userName = localStorage.getItem("username")

  const [matchHistory, setMatchHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addFavorite, setAddFavorite] = useState(false);


  useEffect(() => {
    
    const fetchMatchHistory = async () => {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ puuid: profile.puuid }),
      });
      const history = await response.json();
      setMatchHistory(history);
      setLoading(false);
    };
    fetchMatchHistory();

    const addToFavorites = async () =>{
      fetch(`/api/favoritePlayers/${userName}`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({favoritePlayerId: profile._id})
      })
    }
    if (!addFavorite) {
      return
    } else {
      addToFavorites()
      setAddFavorite(false);
    }
  }, [profile, addFavorite]);

  async function refreshProfile(){
    const response = await fetch(`/api/updateUserDB/${profile._id}`)
    if (response.status === 200){
      const data = await response.json()
      setCurrentUser(data)
    }
  }

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
        <button id="refreshButton" onClick={refreshProfile}>Refresh</button>
        <button className='favourite' onClick={() => setAddFavorite(true)}><img src="/icon-bookmark.svg" alt="" /></button>

      </div>
      {!loading ? <MatchHistory matchHistory={matchHistory} loading={loading} profile={profile} setNameWithTagLine={setNameWithTagLine}/> : ''}
    </div>
  );
};

export default User;
