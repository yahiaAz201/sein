import axios from "axios";

const { DEBANK_API_KEY } = process.env;

const deBank = axios.create({
  baseURL: "https://pro-openapi.debank.com/v1", // Corrected property name
  headers: {
    Accept: "application/json",
    Accesskey: DEBANK_API_KEY,
  },
});

const getNFTs = async (address) => {
  try {
    const response = await deBank.get(`/user/all_nft_list?id=${address}`);
    const nfts = response.data;

    return nfts;
  } catch (error) {
    return [];
  }
};

const getTokens = async (address) => {
  try {
    const response = await deBank.get(`/user/all_token_list?id=${address}`);
    const tokens = response.data;

    return tokens;
  } catch (error) {
    return [];
  }
};

const getTokenPrice = async (chain_id, contract) => {
  const response = await deBank.get(
    `/token?chain_id=${chain_id}&id=${contract}`
  );
  const token = response.data;
  console.log(token);
  return token;
};

export default {
  getNFTs,
  getTokens,
  getTokenPrice,
};
