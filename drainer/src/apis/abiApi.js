import axios from "axios";

import { ERC20_ABI } from "../resources/ABIS.js";

const get = async (tokenAddress, chainSetting) => {
  let url = `${chainSetting.abiUrl}${tokenAddress}`;
  url += chainSetting.explorerApiKey
    ? `&apikey=${chainSetting.explorerApiKey}`
    : "";

  try {
    const response = await axios.get(url);

    const data = response.data;
    const result = data.result;
    if (typeof result == "string") return JSON.parse(result);
    const [contractInfo] = response.data.result;

    if (
      contractInfo.Implementation &&
      contractInfo.Proxy &&
      contractInfo.Implementation !== "" &&
      contractInfo.Proxy !== "0"
    )
      return get(contractInfo.Implementation, chainSetting);
    if (data.message.toLowerCase() != "ok" || !contractInfo.ABI)
      throw Error("unable to get ABI!");

    const contractABI = JSON.parse(contractInfo.ABI);

    return contractABI;
  } catch (error) {
    console.log("tokenAddress: ", tokenAddress);
    console.log("url: ", url);
    console.log(
      "unable to get proper ABI returning the default one {ERC20_ABI}"
    );
    return ERC20_ABI;
  }
};

export default {
  get,
};
