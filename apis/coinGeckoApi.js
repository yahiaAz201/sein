import axios from "axios";

const getEthPriceInUSD = async () => {
  try {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    console.log("ether price: ", response.data["USD"]);
    return response.data["USD"];
  } catch (error) {
    console.error("Error fetching ETH price:", error.message);
    return 3000;
  }
};

export default {
  getEthPriceInUSD,
};
