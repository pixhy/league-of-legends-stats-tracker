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
  losses: Number
});

export default model('Users', UserSchema);