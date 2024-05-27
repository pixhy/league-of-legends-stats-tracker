import express from "express";
import mongoose from 'mongoose';

const app = express();

app.get('/api/stats', (req, res) => {
  res.status(200).json({message: "ok"})
})

app.listen(3000, () => console.log("http://localhost:3000"));