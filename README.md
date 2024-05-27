No starter code is provided. Start from scratch!

account-v1 summoner id
/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{summonerId}/{tagLine}?api_key=RGAPI-0cf37a2a-d0bb-48c2-a583-65a6ffb40bd4
{
"puuid": "3Ihb40a49EM_j8iAXyZzrZzo022Pdm9FePvskCpbq3rYFmkrJwOUmwFCBgpL6q6PdmtLyAUAKF6y7Q",
"gameName": "Pixhy",
"tagLine": "EUNE"
}

match-v5 get game ids
/lol/match/v5/matches/by-puuid/{puuid}/ids
https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/w3STNmiC24hDa0G1FN15YofJHeYC0CUs0sz1kGR4SPYnAeengIoxxV-d1zfR4Ek3Pa-NMultihqFVQ/ids?start=0&count=20&api_key=RGAPI-0cf37a2a-d0bb-48c2-a583-65a6ffb40bd4

games: [
"EUN1_3602378151",
"EUN1_3602087009",
"EUN1_3601070279",
"EUN1_3601060381",
"EUN1_3601048284",
"EUN1_3601022945",
"EUN1_3601014426",
"EUN1_3600984075",
"EUN1_3600973367",
"EUN1_3600965567",
"EUN1_3600674711",
"EUN1_3600661413",
"EUN1_3600646335",
"EUN1_3600119911",
"EUN1_3600113381",
"EUN1_3599695878",
"EUN1_3599690705",
"EUN1_3599690531",
"EUN1_3599676182",
"EUN1_3597804175"
]

match by id
/lol/match/v5/matches/{matchId}
https://europe.api.riotgames.com/lol/match/v5/matches/EUN1_3602378151?api_key=RGAPI-0cf37a2a-d0bb-48c2-a583-65a6ffb40bd4
