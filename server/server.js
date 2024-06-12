import express from "express";
import mongoose from "mongoose";
import mongooseConnect from "./mongooseConnect.js";
import Users from "./model/Users.js";
import bcrypt from "bcrypt";
import PageUsers from "./model/PageUsers.js";

//import fetchSummonerData from './fetchSummonerData.js';

const apiKey = "RGAPI-84be12ce-79a8-4e41-9764-80bf594e5993";
 
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

app.post("/api/change-password", async (req, res) => {
  const { username, currentPassword ,newPassword } = req.body;

  try {
    const user = await PageUsers.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch){
      return res.status(400).json({message: "ur memory is sh*t"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "ok. u changed morron hope u forget it in 5sxd" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/favoritePlayers/:username', async(req, res) => {
  try {
    const username = req.params.username
    console.log(username)
    const {favoritePlayerId} = req.body;
    console.log(favoritePlayerId)
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
  console.log('username',username , 'favoriteId', favoriteId);

  try {
    const user = await PageUsers.findOne({username: username});
    if(!user){
      return res.status(400).json({message: "no user found"})
    }

    user.favoritePlayers = user.favoritePlayers.filter(player => player._id.toString() !== favoriteId);
    await user.save()

    res.status(200).json({message: 'kitorolve mint a feneked'})
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

  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tagLine}?api_key=${apiKey}`
  );
  const data = await response.json();

  if (response.status === 404) {
    res.status(404).json({ message: "No such user" });
    return;
  }
  const puuid = data.puuid;

  const fetchSummonerId = await fetch(
    `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
  );
  const fetchResponse = await fetchSummonerId.json();

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

  const fetchRankedData = await fetch(
    `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`
  );
  const rankedDataAll = await fetchRankedData.json();
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
  const [profileResponse, rankedResponse] = await Promise.all([
    fetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    ),
    fetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`
    ),
  ]);
  if (profileResponse.status != 200) {
    res.status(500).end();
    return;
  }
  if (rankedResponse.status != 200) {
    res.status(500).end();
    return;
  }
  const update = await profileResponse.json();
  const rankedData = await rankedResponse.json();
  const soloRanked = rankedData.find(
    (ranked) => ranked.queueType === "RANKED_SOLO_5x5"
  );
  if (soloRanked) Object.assign(update, soloRanked);

  const updatedUser = await Users.findOneAndUpdate({ _id: id }, update, {
    new: true,
  });

  res.json(updatedUser);
});

app.post("/api/matches", async (req, res) => {
  const puuid = req.body.puuid;
  const matchResponse = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=3&api_key=${apiKey}`
  );
  const matchList = await matchResponse.json();

  const matchData = await Promise.all(
    matchList.map((matchId) =>
      fetch(
        `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`
      )
    )
  );

  const matches = [];

  for (let match of matchData) {
    const jsonMatch = await match.json();
    matches.push(jsonMatch);
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
