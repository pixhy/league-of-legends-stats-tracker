const fetchSummonerData = async (puuid, apiKey) => {
    const fetchSummonerId = await fetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    );
    const fetchResponse = await fetchSummonerId.json();
    const summonerId = fetchResponse.id;
    const profileIconId = fetchResponse.profileIconId;
    const summonerLevel = fetchResponse.summonerLevel;
    const profileData = { summonerId, profileIconId, summonerLevel };
  
    const fetchRankedData = await fetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`
    );
    const rankedDataAll = await fetchRankedData.json();
  
    console.log("function", profileData, rankedDataAll);
    return { profileData, rankedDataAll };
  };
  export default fetchSummonerData;
  