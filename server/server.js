import express from 'express';
import mongoose from 'mongoose';

import Users from './model/Users.js';
//import fetchSummonerData from './fetchSummonerData.js';

const apiKey = 'RGAPI-9cc70ba5-b31c-42e0-8c55-26b184aff1da';

const app = express();

app.use(express.json());

app.post('/api/userFromRiot', async (req, res) => {
  const region = req.body.region;
  const name = req.body.name;
  const tagLine = req.body.tagLine;

  const response = await fetch(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${apiKey}`);
  const data = await response.json();

  if (response.status === 404) {
    res.status(404).json({ message: 'No such user' });
    res.end()
  }
  

  //match `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`
  const puuid = data.puuid;
  if (puuid) {
    const matchResponse = await fetch(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${apiKey}`
    );
    const matchList = (await matchResponse.json()).slice(0, 3);
    //console.log(matchList);

    if (matchList.length > 0) {
      const matches = [];

      const matchData = await Promise.all(matchList.map(matchId => fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`)));

      for (let match of matchData) {
        const participants = [];
        
        const jsonMatch = await match.json();

        for (const participant of jsonMatch.info.participants) {
          participants.push({
            region: region,
            profileIcon: participant.profileIcon,
            summonerId: participant.summonerId,
            championName: participant.championName,
            individualPosition: participant.individualPosition,
            item0: participant.item0,
            item1: participant.item1,
            item2: participant.item2,
            item3: participant.item3,
            item4: participant.item4,
            item5: participant.item5,
            item6: participant.item6,
            kills: participant.kills,
            assists: participant.assists,
            deaths: participant.deaths,
            summonerLevel: participant.summonerLevel,
            riotIdGameName: participant.riotIdGameName,
            riotIdTagline: participant.riotIdTagline,
            visionScore: participant.visionScore,
            damageDealtToBuildings: participant.damageDealtToBuildings,
            damageDealtToObjectives: participant.damageDealtToObjectives,
            damageDealtToTurrets: participant.damageDealtToTurrets,
            damageSelfMitigated: participant.damageSelfMitigated,
            goldEarned: participant.goldEarned,
            magicDamageDealt: participant.magicDamageDealt,
            magicDamageDealtToChampions: participant.magicDamageDealtToChampions,
            magicDamageTaken: participant.magicDamageTaken,
            physicalDamageDealt: participant.physicalDamageDealt,
            physicalDamageDealtToChampions: participant.physicalDamageDealtToChampions,
            physicalDamageTaken: participant.physicalDamageTaken,
            profile: participant.profileIcon,
            totalDamageDealt: participant.totalDamageDealt,
            totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
            totalDamageShieldedOnTeammates: participant.totalDamageShieldedOnTeammates,
            totalDamageTaken: participant.totalDamageTaken,
            summoner1Id: participant.summoner1Id,
            summoner2Id: participant.summoner2Id,
            teamId: participant.teamId,
            champLevel: participant.champLevel,
            championId: participant.championId,
            championName: participant.championName,
            win: participant.win,
          });
        }

        matches.push({
          matchId: jsonMatch.metadata.matchId,
          gameDuration: jsonMatch.info.gameDuration,
          gameCreation: jsonMatch.info.gameCreation,
          gameMode: jsonMatch.info.gameMode,
          participants: participants,
          teams: [
            {
              baron: jsonMatch.info.teams[0].objectives.baron.kills,
              champion: jsonMatch.info.teams[0].objectives.champion.kills,
              dargon: jsonMatch.info.teams[0].objectives.dragon.kills,
              horde: jsonMatch.info.teams[0].objectives.horde.kills,
              inhibitor: jsonMatch.info.teams[0].objectives.inhibitor.kills,
              riftHerald: jsonMatch.info.teams[0].objectives.riftHerald.kills,
              win: jsonMatch.info.teams[0].objectives.win,
            },
            {
              baron: jsonMatch.info.teams[1].objectives.baron.kills,
              champion: jsonMatch.info.teams[1].objectives.champion.kills,
              dargon: jsonMatch.info.teams[1].objectives.dragon.kills,
              horde: jsonMatch.info.teams[1].objectives.horde.kills,
              inhibitor: jsonMatch.info.teams[1].objectives.inhibitor.kills,
              riftHerald: jsonMatch.info.teams[1].objectives.riftHerald.kills,
              win: jsonMatch.info.teams[1].objectives.win,
            },
          ],
        });
      }

      const fetchSummonerId = await fetch(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`);
      const fetchResponse = await fetchSummonerId.json();
      const summonerId = fetchResponse.id;
      const profileIconId = fetchResponse.profileIconId;
      const summonerLevel = fetchResponse.summonerLevel;
      const profileData = { summonerId, profileIconId, summonerLevel, name: name, tagLine: tagLine };

      const fetchRankedData = await fetch(`https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`);
      const rankedDataAll = await fetchRankedData.json();

      //const summonerData = fetchSummonerData(puuid, apiKey);
      res.json({ matches, rankedDataAll, profileData });
    } else {
      //player has no match history - fetch summoner ID, summoner level and profile icon
      const fetchSummonerId = await fetch(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`);
      const fetchResponse = await fetchSummonerId.json();
      const summonerId = fetchResponse.id;
      const profileIconId = fetchResponse.profileIconId;
      const summonerLevel = fetchResponse.summonerLevel;

      const profileData = { summonerId, profileIconId, summonerLevel };
      console.log('rankedData', profileData);
      //const summonerData = fetchSummonerData(puuid, apiKey);
      res.json(profileData);
    }
  } 
});

app.get('/api/stats', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.listen(3000, () => console.log('http://localhost:3000'));
