import fs from "fs"


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let servers = [
  "eun1.api.riotgames.com",
  "europe.api.riotgames.com",
  "americas.api.riotgames.com",
  "asia.api.riotgames.com",
];


const key = 'RGAPI-a39cc35b-5a03-430d-99e7-2865bc68b521'
const queue = 'RANKED_SOLO_5x5';
let serverRateLimit = {}

for(let server of servers){
  serverRateLimit[server] = {
    lastRequest: 0
  }
}
console.log(serverRateLimit)
async function fetchRiotAPI(server, endpoint){
  let serverInfo = serverRateLimit[server]


  let currentTime = +(new Date())
  let timeSinceLastRequest = currentTime - serverInfo.lastRequest
  if(timeSinceLastRequest < 1200){
    await delay(1200 - timeSinceLastRequest)
    currentTime = +(new Date());
  }
  serverInfo.lastRequest = currentTime

  const url = `https://${server}/${endpoint}`;
  const response = await fetch(url,{
    headers: {"X-Riot-Token": key}
  })

  if (response.status === 429){
    const waittime = +response.headers.get("Retry-After");
    console.log("server sent 429, retry-after: ", waittime);
    await delay(waittime * 1000);
    serverInfo.cooldownUntil = 0;
    serverInfo.firstRequestTimestamp = 0;
    return await fetchRiotAPI(server, endpoint)
  }

  if (response.status === 200){
    return await response.json()
  }
  else if (response.status == 204){
    return null
  }

  console.log("fatalerror", response, await response.text())
  process.exit()


}

const league_tier = ['DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON']
const league_division = ['I', 'II', 'III', 'IV']

async function fetchDivisionList(tier, division){
  console.log("fetching ",tier,division)
  let list = []
  for (let i=1; ; i++){
    const data = await fetchRiotAPI("eun1.api.riotgames.com", `lol/league/v4/entries/${queue}/${tier}/${division}?page=${i}`);
    if (data === null || data.length === 0) break;
    console.log(data.length);
    list.push(...data)
  }
  console.log(list.length, "users")
  return list
}


async function fetchUserData(divisionList){
  for(let item of divisionList){
    let response1 = await fetchRiotAPI("eun1.api.riotgames.com", "lol/summoner/v4/summoners/"+item.summonerId)
    if(!response1){
      process.exit();
    }
    let response2 = await fetchRiotAPI("europe.api.riotgames.com", "riot/account/v1/accounts/by-puuid/"+response1.puuid)
    Object.assign(item, response1, response2);
  }
}


async function main(){
	for (let tier of league_tier){
	  for(let div of league_division){
	    let list = await fetchDivisionList(tier, div)
	    await fetchUserData(list)
	    fs.writeFileSync(`${tier}_${div}.json`, JSON.stringify(list))
	    console.log(list.length);
	  }
	}
}

//main().then(()=>console.log("EOF"))