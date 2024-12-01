import seinApi from "../apis/seinApi.js";

const telegramNotification = async (req, res) => {
  const { event, payload } = req.body;
  const { USER_ID, BUNDLE_ID } = req.user;

  const response = await seinApi.telegramNotification({
    USER_ID,
    BUNDLE_ID,
    event,
    payload,
  });

  res.send(response);
};

export default {
  telegramNotification,
};
