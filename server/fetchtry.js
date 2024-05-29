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