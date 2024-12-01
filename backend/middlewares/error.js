import logger from "../utils/logger.js";

export default function (error, req, res, next) {
  logger.error(error);
  res.status(500).send(error.message);
}
