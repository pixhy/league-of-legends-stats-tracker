import { useState } from 'react';
import Loading from './Loading/Loading';

const Match = ({ match, profile, loading }) => {
  const [isOpen, setIsOpen] = useState(false)
  //console.log("match", match)
  //console.log("profile", profile)
  const team1 = match.info.participants.filter((player) => player.teamId === 100);
  const team2 = match.info.participants.filter((player) => player.teamId !== 100);
  const userProfile = match.info.participants.find(player => {
    // console.log("player.summonerId",player.summonerId)
    // console.log('profile.summonerId',profile.summonerId);
    if (player.summonerId === profile.summonerId) {
      //console.log("itt van cuncikám :)")
    }
    return player.summonerId === profile.summonerId
  });
  //console.log('userProfile', userProfile)

  // console.log(history.participants)

  // const onPlayerClickHandler = (e) => {
  //   setSearchedUser(null)
  //   states.setName(e.target.innerText);
  //   states.setTagLine(e.target.classList[0].toLowerCase());
  //   states.setRegion(e.target.classList[1]);

  //   states.setSubmitted((prev) => !prev);
  // };

  if(loading || !userProfile) {
    return <Loading/>
  }
  
  return (
    
    <>
      {!isOpen ? 
      <div onClick={() => setIsOpen((prev) => !prev)} className='closedHistory'>
        <img src={`champion/${userProfile.championName.toLowerCase()}.png`} alt="" />
        <span>{userProfile.champLevel}</span>
        <div className="summonerSpells">
          <img src={`spell/${userProfile.summoner1Id}.png`} alt="summonerSpell" />
          <img src={`spell/${userProfile.summoner2Id}.png`} alt="summonerSpell" />
        </div>
        <div className="items">
          <img src={`item/${userProfile.item0}.png`} alt="" />
          <img src={`item/${userProfile.item1}.png`} alt="" />
          <img src={`item/${userProfile.item2}.png`} alt="" />
          <img src={`item/${userProfile.item3}.png`} alt="" />
          <img src={`item/${userProfile.item4}.png`} alt="" />
          <img src={`item/${userProfile.item5}.png`} alt="" />
          <img src={`item/${userProfile.item6}.png`} alt="" />
        </div>
        <div className="stats">
          <span>{userProfile.kills} K / </span>
          <span>{userProfile.deaths} D / </span>
          <span>{userProfile.assists} A </span>
        </div>
      </div> :
      
      <div className="oneMatch" onClick={() => setIsOpen(prev => !prev)}>
      <div className={'fullTeam1 individualTeam'}>
        {team1.map((player) => (
          <div className={`team1 individualTeam ${player.win ? 'playerWin' : 'playerLose'}`} key={player.riotIdGameName + match.matchId}>
            <div className={`matchContainer`}>
              <img src={`champion/${player.championName.toLowerCase()}.png`} alt="" />
              <span className={`${player.riotIdTagline} ${player.region} player`}>
                {player.riotIdGameName}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={'fullTeam2 individualTeam'}>
        {team2.map((player) => (
          <div className={`team2 individualTeam ${player.win ? 'playerWin' : 'playerLose'}`} key={player.riotIdGameName + match.matchId}>
            <div className={`matchContainer`}>
              <img src={`champion/${player.championName.toLowerCase()}.png`} alt="" />
              <span className={`${player.riotIdTagline} ${player.region} player`}>
                {player.riotIdGameName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>}
    </>
  );
};

export default Match;
