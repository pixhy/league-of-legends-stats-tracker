//import { useState } from 'react';
import Loading from './Loading/Loading';
import { useNavigate } from "react-router-dom"

const Match = ({ match, profile, loading, setNameWithTagLine }) => {
  const navigate = useNavigate();

  const team1 = match.info.participants.filter((player) => player.teamId === 100);
  const team2 = match.info.participants.filter((player) => player.teamId !== 100);
  const userProfile = match.info.participants.find(player => player.summonerId === profile.summonerId);
  let matchResult;
  if (userProfile){
    matchResult = userProfile.win
  }
  const matchStart = match.info.gameStartTimestamp
  const matchEnd = match.info.gameEndTimestamp
  const dateItem = new Date(matchEnd-matchStart)
  const matchDuration = dateItem.getMinutes() + "m " + dateItem.getSeconds() + "s"


  const onPlayerClickHandler = (e, player) => {
    setNameWithTagLine({name: player.riotIdGameName, tagLine: player.riotIdTagline});
    navigate(`/summoners/eune/${player.riotIdGameName}/${player.riotIdTagline}`)
  };

  if(loading || !userProfile ) {
    return <Loading/>
  }
  
  return (
    
    <>
      <div className="theMatch">
        <div className="matchResult">
          { matchResult ? "Victory" : "Defeat" }

          <div>{matchDuration}</div>
          
        </div>

        <div className="currentPlayer">
          <img src={`/champion/${userProfile.championName.toLowerCase()}.png`} alt="" />
          <span>{userProfile.champLevel}</span>
          <div className="summonerSpells">
            <img src={`/spell/${userProfile.summoner1Id}.png`} alt="summonerSpell" />
            <img src={`/spell/${userProfile.summoner2Id}.png`} alt="summonerSpell" />
          </div>
          <div className="items">
            <img src={`/item/${userProfile.item0}.png`} alt="" />
            <img src={`/item/${userProfile.item1}.png`} alt="" />
            <img src={`/item/${userProfile.item2}.png`} alt="" />
            <img src={`/item/${userProfile.item3}.png`} alt="" />
            <img src={`/item/${userProfile.item4}.png`} alt="" />
            <img src={`/item/${userProfile.item5}.png`} alt="" />
            <img src={`/item/${userProfile.item6}.png`} alt="" />
          </div>
          <div className="stats">
            <span>{userProfile.kills}  / </span>
            <span>{userProfile.deaths}  / </span>
            <span>{userProfile.assists}  </span>
          </div>
        </div> 
        

        <div className="players">
          <div className="oneMatch">
          <div className={'fullTeam1 individualTeam'}>
            {team1.map((player) => (
              <div className={`team1 individualTeam ${player.win ? 'playerWin' : 'playerLose'} ${player.riotIdGameName === userProfile.riotIdGameName ? "currPlayer" : ""}`} key={player.riotIdGameName + match.matchId}>
                <div className={`matchContainer`}>
                  <img src={`/champion/${player.championName.toLowerCase()}.png`} alt="" />
                  <span className={`${player.riotIdTagline} ${player.region} player`} onClick={(e) => onPlayerClickHandler(e, player)}>
                    {player.riotIdGameName}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className={'fullTeam2 individualTeam'}>
            {team2.map((player) => (
              <div className={`team2 individualTeam ${player.win ? 'playerWin' : 'playerLose'} ${player.riotIdGameName === userProfile.riotIdGameName ? "currPlayer" : ""}`} key={player.riotIdGameName + match.matchId}>
                <div className={`matchContainer`}>
                  <img src={`/champion/${player.championName.toLowerCase()}.png`} alt="" />
                  <span className={`${player.riotIdTagline} ${player.region} player`} onClick={(e) => onPlayerClickHandler(e, player)}>
                    {player.riotIdGameName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Match;
