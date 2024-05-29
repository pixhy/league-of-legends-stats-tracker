const fetchUsers = async () => {
  const starterPage = 1
  const maxPage = 1;
  const apiKey = 'RGAPI-75c2a006-b793-491b-a812-a58c8a6564e9';
  const queue = 'RANKED_SOLO_5x5';
  const tier = 'DIAMOND';
  const division = 'I';
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = starterPage; i <= maxPage; i++) {
    try {
      // const response = await fetch(`https://eun1.api.riotgames.com/lol/league/v4/entries/${queue}/${tier}/${division}?page=${i}&api_key=${apiKey}`);
      // const response = await fetch('https://eun1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=RGAPI-75c2a006-b793-491b-a812-a58c8a6564e9')
      const data = await response.json();

      let j = 0;
      for (const user of data.entries) {
        j++;
        const leagueId = data.leagueId;
        const queueType = data.name;
        const tier = data.tier;
        const rank = user.rank;
        const summonerId = user.summonerId;
        const leaguePoints = user.leaguePoints;
        const wins = user.wins;
        const losses = user.losses;

        const newUser = new Users({
          leagueId,
          queueType,
          tier,
          rank,
          summonerId,
          leaguePoints,
          wins,
          losses
        });

        try {
          await newUser.save();
          console.log(`Success: Page ${i}, User ${j}`);
        } catch (error) {
          console.log(`Error saving user on Page ${i}, User ${j}:`, error);
        }
      }

      console.log(`Finished processing page ${i}`);
    } catch (error) {
      console.log(`Error fetching data for page ${i}:`, error);
    }

    await delay(1000); // Wait for 1 second before the next request
  }

  console.log('All data fetched and saved');
};

fetchUsers();

// const fetchUsers = async () => {
//   const alldata = [];
//   const apiKey = 'RGAPI-75c2a006-b793-491b-a812-a58c8a6564e9';
//   const queue = 'RANKED_SOLO_5x5';
//   const tier = 'SILVER';
//   const division = 'III';
//   const maxPage = 20
//   setTimeout(() => {
    
//   }, 1000)
//   for (let i = 1; i <= maxPage; i++) {
//     const response = await fetch(`https://eun1.api.riotgames.com/lol/league/v4/entries/${queue}/${tier}/${division}?page=${i}&api_key=${apiKey}`);
//     const data = await response.json();
//     let j = 0
//     for (const user of data) {
      
//       j++;
//       const leagueId = user.leagueId
//       const queueType = user.queueType
//       const tier = user.tier
//       const rank = user.rank
//       const summonerId = user.summonerId
//       const leaguePoints = user.leaguePoints
//       const wins = user.wins
//       const losses = user.losses
//       const newUser = new Users({
//         leagueId,
//         queueType,
//         tier,
//         rank,
//         summonerId,
//         leaguePoints,
//         wins,
//         losses
//       });
//       newUser.save()
//       .then((user) => console.log("suxeszfűl ", user))
//       .catch(error => console.log("erór"))
//     }
//     // alldata.push(...data);
//   }
  
//   //🦥kiscica🐈🐈‍⬛\\
//   console.log('mögvan')
// };

// fetchUsers();
