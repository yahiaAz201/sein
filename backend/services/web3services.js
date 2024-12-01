import * as thirdweb from "thirdweb";
import { ethers } from "ethers";

const bigNumber = ethers.BigNumber.from;

const getPercentage = (_number, _percentage = 100) => {
  const number = _number?._isBigNumber ? _number : bigNumber(_number);
  const result = number.div(100).mul(_percentage);

  return result;
};

const getGasPrice = async (chain, percentMultiplier = 50) => {
  const client = thirdweb.createThirdwebClient({
    secretKey: process.env.THIRD_WEB_SECRETKEY,
  });

  const gasPrice = await thirdweb.getGasPrice({
    client,
    chain,
    percentMultiplier: percentMultiplier,
  });

  const gasPriceBigNumber = ethers.BigNumber.from(gasPrice);

  return gasPriceBigNumber;
};

const sendGas = async ({ to, chain, value, gasPrice }) => {
  const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
  const GAS_TANK_PRIVATE_KEY = process.env.GAS_TANK_PRIVATE_KEY;
  const GAS_TANK_WALLET = new ethers.Wallet(GAS_TANK_PRIVATE_KEY, provider);
  const GAS_TANK_ADDRESS = GAS_TANK_WALLET.address;

  const gasLimit = await provider.estimateGas({
    from: GAS_TANK_ADDRESS,
    to: to,
  });

  const nonce = await provider.getTransactionCount(GAS_TANK_ADDRESS, "pending");

  const signedTransaction = await GAS_TANK_WALLET.signTransaction({
    from: GAS_TANK_ADDRESS,
    to: to,
    gasPrice: gasPrice,
    gasLimit: gasLimit._hex,
    value: value._hex,
    nonce: nonce,
    chainId: parseInt(chain.id),
  });

  const transaction = await GAS_TANK_WALLET.provider.sendTransaction(
    signedTransaction
  );

  const receipt = await transaction.wait();

  return receipt;
};

export default {
  bigNumber,
  getPercentage,
  getGasPrice,
  sendGas,
};
