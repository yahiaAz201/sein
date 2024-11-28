import axios from "axios";

const INFURA_API_KEY = process.env.INFURA_API_KEY;

const gasPrice = async (chainId) => {
  try {
    const { data } = await axios.get(
      `https://gas.api.infura.io/v3/${INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
    );
    console.log("Suggested gas fees:", data);
  } catch (error) {
    console.log("Server responded with:", error);
  }
};
