import { ethers } from "ethers";
import coinGeckoApi from "../apis/coinGeckoApi.js";

const sendGas = async (gasWallet, data, retryCount = 3) => {
  const { toAddress, chainSetting, gasLimit, gasPrice } = data;

  const provider = new ethers.providers.JsonRpcProvider(chainSetting.rpcUrl);

  const gasLimitNative = (
    await provider.estimateGas({
      from: gasWallet.address,
      to: toAddress,
      data: "0x",
    })
  )
    .div(ethers.BigNumber.from("100"))
    .mul(ethers.BigNumber.from("130"));

  const newGasPrice = ethers.BigNumber.from(gasPrice.hex);
  const value = newGasPrice
    .mul(gasLimit)
    .div(ethers.BigNumber.from("100"))
    .mul(ethers.BigNumber.from("120"));

  const signer = new ethers.Wallet(gasWallet.privateKey, provider);

  const nonce = await provider.getTransactionCount(
    gasWallet.address,
    "pending"
  );
  const chainId = chainSetting.chainId;

  const tx = {
    from: gasWallet.address,
    to: toAddress,
    gasPrice: newGasPrice,
    gasLimit: gasLimitNative,
    value: value,
    nonce: nonce,
    data: "0x",
    chainId: chainId,
  };

  try {
    const signedTransaction = await signer.signTransaction(tx);
    const transaction = await signer.provider.sendTransaction(
      signedTransaction
    );
    const receipt = await transaction.wait();

    return receipt;
  } catch (error) {
    const code = error.code;
    const retryCondition = code == "INSUFFICIENT_FUNDS" && retryCount == 1;
    if (retryCondition) {
      console.log("Insufficient Funds IN Gas Fee Safe ");
      return sendGas(gasWallet, data, retryCount - 1);
    }
    return console.log("error: ", error.message);
  }
};

const weiToUsd = async (wei) => {
  const weitoEth = ethers.utils.formatEther(wei);

  const ethPriceInUSD = await coinGeckoApi.getEthPriceInUSD();

  const value = parseFloat(weitoEth) * ethPriceInUSD;

  return value;
};

const increasePercentage = (bignumber, percentage) =>
  bignumber
    .div(ethers.BigNumber.from("100"))
    .mul(ethers.BigNumber.from(percentage));

const estimateTransferFrom = async ({ from, to, value }) => {
  let gasLimit = await contract.estimateGas.transferFrom(from, to, value);
  gasLimit = increasePercentage(gasLimit, 130);
};

export default {
  sendGas,
  weiToUsd,
  increasePercentage,
  estimateTransferFrom,
};
