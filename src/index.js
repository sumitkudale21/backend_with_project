// require("dotenv").config({path: "./.env"});

import app from "./app.js"; // Import the app from app.js

import dotenv from "dotenv";
dotenv.config({ 
  path: "./.env" 
});



import connectDB from "./db/index.js";




connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


































/*
import express from "express";
const app = express();
( async () => {
  try{
      await mongoose.connect(`${process.env.MONGO_URI}/${BE_PRO}`)
      app.on("error", (err) => {
        console.error("Express error:", err);
        throw err;
      });

      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });

  }catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
})();
*/