import https from "https";
import axios from "axios";

import CONSTANTS from "../config/CONSTANTS.js";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const sein = axios.create({
  baseURL: CONSTANTS.SEIN_BASE_URL,
  timeout: 30000,
  rejectUnauthorized: false,
  httpsAgent: httpsAgent,
});

const getUserBundle = async (userId, bundleId) => {
  try {
    console.log(
      "url: ",
      `${CONSTANTS.SEIN_BASE_URL}/user/${userId}/bundle/${bundleId}`
    );
    const response = await sein.get(`/user/${userId}/bundle/${bundleId}`);
    return response.data;
  } catch (error) {
    console.error(error.request);
    return { error: "no response" };
  }
};

const getUser = async (userId) => {
  try {
    const response = await sein.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: "no response" };
  }
};

const telegramNotification = async (data) => {
  try {
    console.log("data: ", data);
    const response = await sein.post("/telegramNotification", data);
    return response.data;
  } catch (error) {
    console.log("unable to send telegram notifications Error: ", error.message);
  }
};

export default {
  getUser,
  getUserBundle,
  telegramNotification,
};
