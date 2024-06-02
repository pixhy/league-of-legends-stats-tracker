import fs from "fs"


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let servers = [
  "eun1.api.riotgames.com",
  "europe.api.riotgames.com",
  "americas.api.riotgames.com",
  "asia.api.riotgames.com",
];


const key = 'RGAPI-cfa67bd7-8ff3-4212-829d-9fef696bf635'
const queue = 'RANKED_SOLO_5x5';
let serverRateLimit = {}

for(let server of servers){
  serverRateLimit[server] = {
    lastRequest: 0
  }
}

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
  let response
  try {
    response = await fetch(url,{headers: {"X-Riot-Token": key}})
  }
  catch(x){
  	console.log("fetch exception", x)
  	await delay(30000)
  	return await fetchRiotAPI(server, endpoint)
  }

  if (response.status === 429){
    const waittime = +response.headers.get("Retry-After");
    console.log("server sent 429, retry-after: ", waittime);
    await delay(waittime * 1000);
    return await fetchRiotAPI(server, endpoint)
  }
  
  if (response.status === 200){
    return await response.json()
  }
  else if (response.status == 204){
    return null
  }
  else if (response.status >= 500) {
    console.dir(response,{depth:4});
    await delay(60000)
    return await fetchRiotAPI(server, endpoint)
  }
  else {
    console.dir(response,{depth:4});
    console.log("server error", await response.text())
    throw new Error("response "+response.status)
  }
}

const league_tier = ['DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON']
const league_division = ['I', 'II', 'III', 'IV']

async function fetchDivisionList(tier, division){
  console.log("fetching ",tier,division)
  let list = []
  for (let i=1; ; i++){
    const data = await fetchRiotAPI("eun1.api.riotgames.com", `lol/league/v4/entries/${queue}/${tier}/${division}?page=${i}`);
    if (data === null || data.length === 0) break;
    list.push(...data)
  }
  console.log(list.length, "users")
  return list
}


async function fetchUserData(divisionList){
  for(let [index, item] of divisionList.entries()){
    process.stdout.write(`${index+1}/${divisionList.length}\r`)
    
  	if("gameName" in item) continue
  	
    let response1 = await fetchRiotAPI("eun1.api.riotgames.com", "lol/summoner/v4/summoners/"+item.summonerId)
    if(!response1){
      throw new Error("summoner endpoint returned no data")
    }
    let response2 = await fetchRiotAPI("europe.api.riotgames.com", "riot/account/v1/accounts/by-puuid/"+response1.puuid)
    if(!response2){
    	throw new Error("account endpoint returned no data")
    }
    Object.assign(item, response1, response2);
  }
}


async function main(){
	for (let tier of league_tier){
	  for(let div of league_division){
      let outfile = `${tier}_${div}.json`
	    if(fs.existsSync(outfile))continue;
	    let partial = `${tier}_${div}_partial.json`
	    let list
	    if(!fs.existsSync(partial)){
	    	list = await fetchDivisionList(tier, div)
	    }
	    else {
	    	console.log("continuing partial file", partial)
	    	list = JSON.parse(fs.readFileSync(partial))
	    	fs.unlinkSync(partial)
	    }
	    let ok = false
	    try {
		    await fetchUserData(list)
      	ok = true
  	    fs.writeFileSync(outfile, JSON.stringify(list))
  	    console.log(list.length);
	    }
	    finally {
	    	if(!ok){
	    		fs.writeFileSync(partial, JSON.stringify(list))
	    		console.log("partial result saved to",partial)
	    	}
	    }
	  }
	}
}

main()
