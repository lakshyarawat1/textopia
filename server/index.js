import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/userSchema.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
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
const bcryptSalt = bcrypt.genSaltSync(10);

app.get("/", (req, res) => {
  res.status(200).json("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
      console.log(userData)
    });
  } else {
    res.status(401).json("token not found");
  }
});

app.post("/register", async (req, res) => {
  const { userName, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, bcryptSalt);
  try {
    const createdUser = await User.create({
      userName,
      password: hashPassword,
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

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const foundUser = await User.findOne({ userName });

  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);

    if (passOk) {
      jwt.sign(
        { userId: foundUser, id: userName },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

app.listen(3000, () => console.log("listening on port 3000"));
