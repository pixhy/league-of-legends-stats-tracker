import express from 'express';
import mongoose from 'mongoose';
import mongooseConnect from './mongooseConnect.js';
import Users from './model/Users.js';

const apiKey= 'RGAPI-31f9854e-e67f-4d10-9722-d4613aa86af9'

const app = express();
mongoose.connect(mongooseConnect);
app.use(express.json());

app.get('/api/users', async (req, res) => {
  const response = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Kol/eune?api_key=${apiKey}`)
  const data = await response.json()
  console.log('data',data);
  res.json(data);
})

app.post('/api/userFromRiot', async (req, res) => {
  const region = req.body.region;
  const name = req.body.name;
  const tagLine = req.body.tagLine;
  const response = await fetch(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${apiKey}`)
  const data = await response.json()
  //match `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`
  const puuid = data.puuid;
  if (response) {
    const matchResponse = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${apiKey}`);
    const matchData = await matchResponse.json()
    if (matchData) {

      // const matches = Promise.all(matchData.map(async (matchId) => {
      //   const match = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}` )
      //   const jsonMatch = await match.json()
      //   return jsonMatch
      // }))
      const matches= [];

      for(let matchId of matchData) {
        const match = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}` );
        const jsonMatch = await match.json();
        
        const participants = []
        for(const participant of jsonMatch.info.participants) {
          participants.push({
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
            riotIdTagLine: participant.riotIdTagLine,
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
            win: participant.win
          })
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
              win: jsonMatch.info.teams[0].objectives.win
            },
            {
              baron: jsonMatch.info.teams[1].objectives.baron.kills,
              champion: jsonMatch.info.teams[1].objectives.champion.kills,
              dargon: jsonMatch.info.teams[1].objectives.dragon.kills,
              horde: jsonMatch.info.teams[1].objectives.horde.kills,
              inhibitor: jsonMatch.info.teams[1].objectives.inhibitor.kills,
              riftHerald: jsonMatch.info.teams[1].objectives.riftHerald.kills,
              win: jsonMatch.info.teams[1].objectives.win
            }
          ]
        });
      }
      res.json(matches)
    }
  }
})

app.get('/api/stats', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.listen(3000, () => console.log('http://localhost:3000'));