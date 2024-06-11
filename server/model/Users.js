import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const UserSchema =  new Schema({
  leagueId: String,
  queueType: String,
  tier: String,
  rank: String,
  summonerId: String,
  leaguePoints: Number,
  wins: Number,
  losses: Number,
  veteran: Boolean,
  inactive: Boolean,
  freshBlood: Boolean,
  hotSteak: Boolean,
  id: String,
  puuid: String,
  accountId: String,
  profileIconId: Number,
  summonerLevel: Number,
  revisionDate: Number,
  gameName: String,
  tagLine: String
});

export default model('Users', UserSchema);