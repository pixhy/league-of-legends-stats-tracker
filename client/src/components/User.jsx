const User = ({ profile }) => {
  const user = profile.profileData;
  const rank = profile.rankedDataAll.find((ranked) => ranked.queueType === "RANKED_SOLO_5x5")

  if (profile.message) {
    return <div className="profileError">{profile.message}</div>;
  }

  console.log("profile.rankedDataAll[0]: ",profile.rankedDataAll[0]);
  console.log("user: ", user)

  return (
    <div className="userData">
      <div className="iconAndLevel">
        <span className="summonerLevel">{user.summonerLevel}</span>
        <img className="summonerIcon" src={`/profileicon/${user.profileIconId}.png`} alt="profileicon" />
      </div>
      <div className="summonerName">
        {user.name} #{user.tagLine}
      </div>
      {!rank ? (
        <img src="/tier/UNRANKED.png" alt=""  />
      ) : (
        <div className="division">
          <div className="tierImg">
            <img src={`/tier/${rank.tier}.png`} alt={rank} />
          </div>
          <div className="rankData">
            <div className="tierAndLp">
              <span className="Lp">{rank.leaguePoints}LP </span>
              <span className="tier">{rank.tier} </span>
              <span className="rank">{rank.rank}</span>
            </div>
            <div className="winLose">
              <span className="win">{rank.wins}W </span>
              <span className="lose">{rank.losses}L</span>
            </div>
            <span className="winrate">Win Rate {((rank.wins / (rank.wins + rank.losses)) * 100).toFixed(0)} %</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
