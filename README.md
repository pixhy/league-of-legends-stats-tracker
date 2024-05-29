DAY 1:

Figma: https://www.figma.com/board/yL4VuDH0xiv2H8WgDcI0re/lol-site?node-id=0-1&t=8oKvD91fzMtGhp3d-1
Github project: https://github.com/orgs/CodecoolGlobal/projects/119/

DAY 2: 

Building database - fetching playerbase by rank (will take approx. 7 days): 
20 fetch / 1 sec
Iron 4: 16 page
Iron 3: 37 page
Iron 2: 101 page
Iron 1: 101 page

Bronze 4: 177 page
Bronze 3: 139 page
Bronze 2: 139 page
Bronze 1: 89 page

Silver 4: 152 page
Silver 3: 111 page
Silver 2: 103 page
Silver 1: 69 page

Gold 4: 140 page
Gold 3: 92 page
Gold 2: 75 page
Gold 1: 56 page

Plat 4: 134 page
Plat 3: 106 page
Plat 2: 111 page
Plat 1: 71 page

Emerald 4: 125 page
Emerald 3: 70 page
Emerald 2: 52 page
Emerald 1: 30 page

Dia 4: 49 page
Dia 3: 31 page
Dia 2: 21 page
Dia 1: 10 page

total page sum 2268
ranked playerbase: 501 073


DAY 3:

gather neccessary match data :

info.gameDuration
info.gameCreation
info.gameMode

info.participants[
  {
    championName
    individualPosition
    item0
    item1
    item2
    item3
    item4
    item5
    item6
    kills
    assists
    deaths
    summonerLevel
    riotIdGameName
    riotIdTagline
    visionScore
    damageDealtToBuildings
    damageDealtToObjectives
    damageDealtToTurrets
    damageSelfMitigated

    goldEarned

    magicDamageDealt
    magicDamageDealtToChampions
    magicDamageTaken

    physicalDamageDealt
    physicalDamageDealtToChampions
    physicalDamageTaken

    profileIcon

    totalDamageDealt
    totalDamageDealtToChampions
    totalDamageShieldedOnTeammates
    totalDamageTaken

    Summoner spells:
    summoner1Id
    summoner2Id

    100 or 200 (100 = blue side, 200 = red side)
    teamId

    champLevel
    championId
    championName

    win
  }
]

teams[
  baron.kills
  champion.kills
  dragon.kills
  horde.kills
  inhibitor.kills
  riftHerald.kills
  win
]