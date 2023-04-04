import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/userSchema.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
// DB configuration
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB"));

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const jwtSecret = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.status(200).json("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("token not found");
  }
});

app.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const createdUser = await User.create({
      userName,
      password,
    });
    jwt.sign(
      { userId: createdUser._id, userName },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.listen(3000, () => console.log("listening on port 3000"));
