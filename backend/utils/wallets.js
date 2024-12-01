import fs from "fs";
import path from "path";
import getDirname from "./getDirname.js";

const __dirname = getDirname(import.meta.url);

const walletsPath = "../data/wallets.json";
const walletsAbsolutePath = path.resolve(__dirname, walletsPath);

const add = (address, privateKey) => {
  let walletData = {};

  try {
    const data = fs.readFileSync(walletsAbsolutePath, "utf-8");
    walletData = JSON.parse(data);
  } catch (error) {}
  walletData[address] = privateKey;
  fs.writeFileSync(
    walletsAbsolutePath,
    JSON.stringify(walletData, null, 2),
    "utf-8"
  );
};

const get = (address) => {
  const data = fs.readFileSync(walletsAbsolutePath, "utf-8");
  const walletData = JSON.parse(data);

  return walletData[address];
};

export default {
  add,
  get,
};
