const Match = ({ match }) => {
  console.log("match", match)
  const team1 = match.info.participants.filter((player) => player.teamId === 100);
  const team2 = match.info.participants.filter((player) => player.teamId !== 100);

  // console.log(history.participants)

  // const onPlayerClickHandler = (e) => {
  //   setSearchedUser(null)
  //   states.setName(e.target.innerText);
  //   states.setTagLine(e.target.classList[0].toLowerCase());
  //   states.setRegion(e.target.classList[1]);

  //   states.setSubmitted((prev) => !prev);
  // };

  return (
    <div className="oneMatch">
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
    </div>
  );
};

export default Match;
