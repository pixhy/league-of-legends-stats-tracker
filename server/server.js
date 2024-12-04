import express from "express";
import mongoose from "mongoose";
import mongooseConnect from "./mongooseConnect.js";
import Users from "./model/Users.js";
import bcrypt from "bcrypt";
import PageUsers from "./model/PageUsers.js";

//import fetchSummonerData from './fetchSummonerData.js';

const apiKey = "RGAPI-a9294a10-16ff-445e-bafe-a523aca2b08a";
 
const app = express();
mongoose.connect(mongooseConnect);
app.use(express.json());

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchRiotAPI(region, endpoint, params='') {
  const url = `https://${region}.api.riotgames.com${endpoint}?api_key=${apiKey}&${params}`;
  const response = await fetch(url);
  if(response.status == 429){
    let retrySeconds = Number(response.headers.get('retry-after'));
    console.log("várunk " + retrySeconds + " másodpercet");
    await sleep(retrySeconds * 1000);
    return await fetchRiotAPI(region, endpoint, params);
  }
  if(response.status == 503){
    console.log("riot szerver lekotlott");
    await sleep(5000);
    return await fetchRiotAPI(region, endpoint, params);
  }
  if(response.status != 200 && response.status != 404){
    console.log(url);
    console.log(response.status);
    console.log(response.headers);
    throw "aaaaaaaaaaaaa";
  }
  return await response.json();
}

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

app.post("/api/change-password", async (req, res) => {
  const { username, currentPassword ,newPassword } = req.body;

  try {
    const user = await PageUsers.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch){
      return res.status(400).json({message: "Wrong pw"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "pw changed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/favoritePlayers/:username', async(req, res) => {
  try {
    const username = req.params.username
    const {favoritePlayerId} = req.body;
    const updatedUser = await PageUsers.findOneAndUpdate(
      {username: username},
      {$addToSet: {favoritePlayers: favoritePlayerId}},
      {new: true, useFindAndModify: false}
    );
    res.json(updatedUser);
  } catch (error) {
    
  }
})

app.get('/api/favoritePlayers/:username', async (req, res) => {
  try {
    const username = req.params.username
    const user = await PageUsers.findOne({username : username}).populate("favoritePlayers").exec()
    if (!user) {
      res.status(404).json({message: "User not found"})
    }
    res.json(user.favoritePlayers)
  } catch (error) {
    res.status(500).json({message: "Server error"})
  }
})

app.delete('/api/favoritePlayers/:username/:favoriteId', async (req, res) => {
  const {username, favoriteId} = req.params;

  try {
    const user = await PageUsers.findOne({username: username});
    if(!user){
      return res.status(400).json({message: "no user found"})
    }

    user.favoritePlayers = user.favoritePlayers.filter(player => player._id.toString() !== favoriteId);
    await user.save()

    res.status(200).json({message: 'Deleted'})
  } catch (error) {
    res.status(500).json({message: 'Server error'})
  }
})

app.delete("/api/delete-profile", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await PageUsers.findOneAndDelete({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/users", async (req, res) => {
  const name = req.query.name;
  const tagLine = req.query.tagLine;
  if (name.length < 3 || tagLine.length < 3) {
    res.status(400).json({ message: "short name" });
    return;
  }

  const userFromDB = await Users.findOne({ gameName: name, tagLine });

  if (userFromDB) {
    res.json(userFromDB);
    return;
  }

  const data = await fetchRiotAPI('europe', `/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}`);

  if (data.status && data.status_code === 404) {
    res.status(404).json({ message: "No such user" });
    return;
  }
  const puuid = data.puuid;

  const fetchResponse = await fetchRiotAPI('eun1', `/lol/summoner/v4/summoners/by-puuid/${puuid}`);

  const summonerId = fetchResponse.id;
  const profileIconId = fetchResponse.profileIconId;
  const summonerLevel = fetchResponse.summonerLevel;
  const accountId = fetchResponse.accountId;
  const profileData = {
    accountId,
    summonerId,
    profileIconId,
    summonerLevel,
    gameName: name,
    tagLine: tagLine,
    puuid: puuid,
  };

  const rankedDataAll = await fetchRiotAPI('eun1', `/lol/league/v4/entries/by-summoner/${summonerId}`);
  
  const soloRanked = rankedDataAll.find(
    (ranked) => ranked.queueType === "RANKED_SOLO_5x5"
  );
  const profile = { ...profileData, ...soloRanked };
  const user = await Users.create(profile);

  res.json(user);
});

app.get("/api/updateUserDB/:id", async (req, res) => {
  const id = req.params.id;
  const additionalIDs = await Users.findOne({ _id: id });

  const summonerId = additionalIDs.summonerId;
  const puuid = additionalIDs.puuid;

  const [update, rankedData] = await Promise.all([
    fetchRiotAPI('eun1', `/lol/summoner/v4/summoners/by-puuid/${puuid}`),
    fetchRiotAPI('eun1', `/lol/league/v4/entries/by-summoner/${summonerId}`),
  ]);
  if (update.status && update.status.status_code != 200) {
    res.status(500).end();
    return;
  }
  if (rankedData.status && rankedData.status.status_code != 200) {
    res.status(500).end();
    return;
  }
  const soloRanked = rankedData.find((ranked) => ranked.queueType === "RANKED_SOLO_5x5");
  
  if (soloRanked) Object.assign(update, soloRanked);

  const updatedUser = await Users.findOneAndUpdate({ _id: id }, update, {
    new: true,
  });
  res.json(updatedUser);
});

app.post("/api/matches", async (req, res) => {
  const puuid = req.body.puuid;
  const matchList = await fetchRiotAPI('europe', `/lol/match/v5/matches/by-puuid/${puuid}/ids`, 'start=0&count=5');

  const matchData = await Promise.all(
    matchList.map((matchId) =>
      fetchRiotAPI('europe', `/lol/match/v5/matches/${matchId}`)
    )
  );

  const matches = [];

  for (let match of matchData) {
    matches.push(match);
  }
  res.json(matches);
});

app.get("/api/usersearch/:gameName", async (req, res) => {
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
        $addFields: { gameNameLength: "$$REMOVE" },
      },
      {
        $limit: 5,
      },
    ]);
    res.json(data);
  }
});


app.listen(3000, () => console.log("http://localhost:3000"));
