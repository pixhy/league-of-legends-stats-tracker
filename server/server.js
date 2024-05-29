import express from 'express';
import mongoose from 'mongoose';
import mongooseConnect from './mongooseConnect.js';
import Users from './model/Users.js';

const apiKey= 'RGAPI-feb5b99e-4135-4f42-882c-e3faa48596fe'

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
    console.log(matchData)
    if (matchData) {

      // const matches = Promise.all(matchData.map(async (matchId) => {
      //   const match = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}` )
      //   return await match.json()
        
      // }))
      const matches= [];

      for(let matchId of matchData) {
        const match = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}` );
        const jsonMatch = await match.json();
        matches.push(jsonMatch);
      }
      console.log("app.post:", matches)
      res.json(matches)
    }
  }
})

app.get('/api/stats', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.listen(3000, () => console.log('http://localhost:3000'));