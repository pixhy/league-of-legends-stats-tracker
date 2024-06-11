import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PageUserSchema = new Schema({
  username: String,
  password: String,
});

export default model("PageUsers", PageUserSchema);
