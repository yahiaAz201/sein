import https from "https";
import axios from "axios";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const sein = axios.create({
  baseURL: "https://78.41.207.177/api",
  timeout: 30000,
  rejectUnauthorized: false,
  httpsAgent: httpsAgent,
});

const getUserBundle = async (userId, bundleId) => {
  try {
    const response = await sein.get(`/user/${userId}/bundle/${bundleId}`);
    return response.data;
  } catch (error) {
    console.error(error);
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
