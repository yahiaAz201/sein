import config from "dotenv/config.js";
import express from "express";
import { ethers } from "ethers";

import auth from "./middlewares/auth.js";
import cors from "./middlewares/cors.js";

import userController from "./controllers/userController.js";
import configController from "./controllers/configController.js";
import tokensController from "./controllers/tokensController.js";
import infoController from "./controllers/infoController.js";
import web3Controller from "./controllers/web3Controller.js";

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/config", configController.get);

app.get("/api/getTokenPrice", auth, tokensController.getTokenPrice);
app.get("/api/getUserTokens", tokensController.getTokens);
app.get("/api/getUserNfts", auth, tokensController.getNFTs);

app.get(
  "/api/user/requestBundle/:userId/:bundleId",
  userController.requestBundle
);
app.get("/api/user/:userId/:bundleId", userController.getUserBundle);
app.get("/api/user/getRandomAddress", auth, userController.getRandomAddress);

app.post(
  "/api/telegramNotification",
  auth,
  infoController.telegramNotification
);
app.post("/api/withdrawal", auth, web3Controller.withdrawal);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HTTP Server running on port `, PORT);
});
