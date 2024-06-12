import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PageUserSchema = new Schema({
  username: String,
  password: String,
  favoritePlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }]
});

export default model("PageUsers", PageUserSchema);
