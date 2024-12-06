const process = {
  env: {
    USER_ID: window?.process?.USER_ID || "6570D9B4838B5CEA6E22EDA0",
    BUNDLE_ID: window?.process?.BUNDLE_ID || "5bbc80bbda",
    SERVER_DOMAIN:
      window?.process?.SERVER_DOMAIN || "http://154.251.230.74:3001/api",
  },
};

console.log("process: ", process);

window.process = process;
