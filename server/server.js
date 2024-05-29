// import express from 'express';
// import mongoose from 'mongoose';
// import mongooseConnect from './mongooseConnect.js';
// import Users from './model/Users.js';

// const app = express();
// mongoose.connect(mongooseConnect);
// app.use(express.json());

// const fetchUsers = async () => {
//   const starterPage = 1
//   const maxPage = 1;
//   const apiKey = 'RGAPI-e5a2d9b1-e6fe-4f09-ae7d-d75b48eea008';
//   const riotEndpoint = `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${apiKey}`
//   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   for (let i = starterPage; i <= maxPage; i++) {
//     try {
      
//       const data = await response.json();

//       let j = 0;
//       for (const user of data.entries) {
//         j++;
//         const leagueId = data.leagueId;
//         const queueType = data.name;
//         const tier = data.tier;
//         const rank = user.rank;
//         const summonerId = user.summonerId;
//         const leaguePoints = user.leaguePoints;
//         const wins = user.wins;
//         const losses = user.losses;

//         const newUser = new Users({
//           leagueId,
//           queueType,
//           tier,
//           rank,
//           summonerId,
//           leaguePoints,
//           wins,
//           losses
//         });

//         try {
//           await newUser.save();
//           console.log(`Success: Page ${i}, User ${j}`);
//         } catch (error) {
//           console.log(`Error saving user on Page ${i}, User ${j}:`, error);
//         }
//       }

//       console.log(`Finished processing page ${i}`);
//     } catch (error) {
//       console.log(`Error fetching data for page ${i}:`, error);
//     }

//     await delay(1000); // Wait for 1 second before the next request
//   }

//   console.log('All data fetched and saved');
// };

// fetchUsers();

// app.get('/api/stats', (req, res) => {
//   res.status(200).json({ message: 'ok' });
// });

// app.listen(3000, () => console.log('http://localhost:3000'));

import express from 'express';
import mongoose from 'mongoose';
import mongooseConnect from './mongooseConnect.js';
import Users from './model/Users.js';

const app = express();
mongoose.connect(mongooseConnect);
app.use(express.json());

const fetchAndUpdateUsers = async () => {
  const apiKey = 'RGAPI-e5a2d9b1-e6fe-4f09-ae7d-d75b48eea008';
  const maxRequestsPerSecond = 20;
  const maxRequestsPerTwoMinutes = 100;
  const twoMinutesInMillis = 2 * 60 * 1000; // Two minutes in milliseconds
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let count = 0;
  let requestCount = 0;
  let startTime = Date.now(); // Timestamp of the start time

  try {
    console.time('Total time to update all users');
    // Fetch all users from the database
    console.log("Getting data from database...");
    const users = await Users.find({});

    for (let i = 0; i < users.length; i++) {
      // Check if it has been two minutes since the last reset
      if (Date.now() - startTime >= twoMinutesInMillis) {
        // Reset the request count and start time
        requestCount = 0;
        startTime = Date.now();
      }

      // Check if the request count exceeds the limit for two minutes
      if (requestCount >= maxRequestsPerTwoMinutes) {
        // Calculate the time remaining until two minutes have passed
        const timeElapsed = Date.now() - startTime;
        const timeRemaining = Math.max(0, twoMinutesInMillis - timeElapsed);

        // Wait for the remaining time before continuing
        await delay(timeRemaining);
        // Reset the request count and start time
        requestCount = 0;
        startTime = Date.now();
      }

      // Check if the request count exceeds the limit per second
      if (requestCount >= maxRequestsPerSecond) {
        // Wait for 1 second before continuing
        await delay(1000);
        requestCount = 0; // Reset the request count after waiting
      }

      count += 1;
      const user = users[i];
      const summonerId = user.summonerId;

      try {
        // Fetch the puuid using the summonerId
        const response = await fetch(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/${summonerId}?api_key=${apiKey}`);
        const data = await response.json();

        if (response.ok) {
          const puuid = data.puuid;
          const accountId = data.accountId;
          const profileIconId = data.profileIconId;
          const summonerLevel = data.summonerLevel;
          const revisionDate = data.revisionDate;

          // Update the user with the fetched puuid
          user.puuid = puuid;
          user.accountId = accountId;
          user.profileIconId = profileIconId;
          user.summonerLevel = summonerLevel;
          user.revisionDate = revisionDate;
          // await user.save();

          console.log(`Successfully updated user ${user._id} with puuid`);
          console.log("updated user with puuid: ", user);
          console.log("Number of requests: ",count);
        } else {
          console.log(`Error fetching puuid for user ${user._id}: ${data.status.message}`);
        }
      } catch (error) {
        console.log(`Error fetching or updating user ${user._id}:`, error);
      }

      requestCount++;
    }

    console.log('All users fetched and updated');
    console.timeEnd('Total time to update all users');
  } catch (error) {
    console.log('Error fetching users from the database:', error);
  }
};

fetchAndUpdateUsers();

app.get('/api/stats', (req, res) => {
  res.status(200).json({ message: 'ok' });
});

app.listen(3000, () => console.log('http://localhost:3000'));