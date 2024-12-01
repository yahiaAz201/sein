import DRAINER_CONFIG from "../config/DRAINER.js";

const get = (req, res) => {
  res.send(DRAINER_CONFIG);
};

export default {
  get,
};
