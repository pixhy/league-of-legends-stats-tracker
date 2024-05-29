const Match = ({ history }) => {

  const team1 = history.participants.filter(player => player.teamId === 100);
  const team2 = history.participants.filter(player => player.teamId !== 100);
  
  
  return (
    <div className="oneMatch">
      <div className=' '></div>
      {/* <div className={`team1 individualTeam `}>
        {team1.map(player => <div key={player.riotIdGameName}>{player.riotIdGameName}</div>)}
      </div>
      <div className={`team2 individualTeam `}>
        {team2.map(player => <div className={} key={player.riotIdGameName}>{player.riotIdGameName}</div>)}
      </div> */}
    </div>
  );
};

export default Match;
