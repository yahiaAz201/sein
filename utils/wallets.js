import fs from "fs";

const walletDataFile = "./data/wallets.json";

const add = (address, privateKey) => {
  let walletData = {};
  try {
    const data = fs.readFileSync(walletDataFile, "utf-8");
    walletData = JSON.parse(data);
  } catch (error) {}
  walletData[address] = privateKey;
  fs.writeFileSync(
    walletDataFile,
    JSON.stringify(walletData, null, 2),
    "utf-8"
  );
};

const get = (address) => {
  const data = fs.readFileSync(walletDataFile, "utf-8");
  const walletData = JSON.parse(data);

  return walletData[address];
};

export default {
  add,
  get,
};
