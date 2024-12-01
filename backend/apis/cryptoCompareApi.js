import axios from "axios";

const cryptoCompare = axios.create({
  baseURL: "https://min-api.cryptocompare.com",
});

const getNativeTokenPrice = async (NATIVE_TOKEN = "ETH", CURRENCY = "USD") => {
  try {
    const response = await cryptoCompare.get(
      `/data/price?fsym=${NATIVE_TOKEN}&tsyms=${CURRENCY}`
    );
    return response.data[CURRENCY];
  } catch (error) {
    console.error("Error fetching ETH price:", error.message);
  }
};

export default {
  getNativeTokenPrice,
};
