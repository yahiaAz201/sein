import logger from "../utils/logger.js";
import seinApi from "../apis/seinApi.js";

const telegramNotification = async (req, res) => {
  try {
    const { event, payload } = req.body;
    const { USER_ID, BUNDLE_ID } = req.user;

    const response = await seinApi.telegramNotification({
      USER_ID,
      BUNDLE_ID,
      event,
      payload,
    });

    res.send(response);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send("Something went wrong when trying to send message");
  }
};

export default {
  telegramNotification,
};
