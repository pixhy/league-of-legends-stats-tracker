import express from "express";
import mongoose from "mongoose";
import mongooseConnect from "./mongooseConnect.js";
import Users from "./model/Users.js";
import bcrypt from "bcrypt";
import PageUsers from "./model/PageUsers.js";
//import fetchSummonerData from './fetchSummonerData.js';

const apiKey = "RGAPI-84164413-2716-4384-a95c-4974fc47c927";
 
const app = express();
mongoose.connect(mongooseConnect);
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await PageUsers.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new PageUsers({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await PageUsers.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Wrong password or username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password or username" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/userFromRiot", async (req, res) => {
  const name = req.body.name;
  const tagLine = req.body.tagLine;
  console.log("name", name, "tagLine", tagLine)
  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${apiKey}`
  );
  const data = await response.json();

  if (response.status === 404) {
    res.status(404).json({ message: "No such user" });
    res.end();
  }
  const puuid = data.puuid;

  const fetchSummonerId = await fetch(
    `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
  );
  const fetchResponse = await fetchSummonerId.json();
  const summonerId = fetchResponse.id;
  const profileIconId = fetchResponse.profileIconId;
  const summonerLevel = fetchResponse.summonerLevel;
  const profileData = {
    summonerId,
    profileIconId,
    summonerLevel,
    gameName: name,
    tagLine: tagLine,
    puuid: puuid
  };

  const fetchRankedData = await fetch(`https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`);
  const rankedDataAll = await fetchRankedData.json();
  const soloRanked = rankedDataAll.find((ranked) => ranked.queueType === "RANKED_SOLO_5x5")
  
  //const summonerData = fetchSummonerData(puuid, apiKey);
  res.json({...profileData, ...soloRanked});
});

app.post("/api/matches", async (req, res) => {
  const puuid = req.body.puuid;
  console.log("puuid", puuid)
  const matchResponse = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${apiKey}`
  );
  const matchList = await matchResponse.json();
  console.log(matchList)
  
  const matchData = await Promise.all(
    matchList.map((matchId) => fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`)));

  const matches = []

  for (let match of matchData) {
    const jsonMatch = await match.json();
    matches.push(jsonMatch)
  }
  console.log(matches)
  res.json(matches);
});

app.get("/api/users/:gameName", async (req, res) => {
  
  if (
    req.params.gameName.length > 2 &&
    req.params.gameName !== null &&
    req.params.gameName !== ""
  ) {
    const nameRegex = req.params.gameName;
    let data = await Users.aggregate([
      {
        $match: { gameName: { $regex: "^" + nameRegex, $options: "i" } },
      },
      {
        $addFields: { gameNameLength: { $strLenCP: "$gameName" } },
      },
      {
        $sort: { gameNameLength: 1 },
      },
      {
        $limit: 5,
      },
    ]);
    res.json(data);
  }
});
app.listen(3000, () => console.log("http://localhost:3000"));
