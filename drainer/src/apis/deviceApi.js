import axios from "axios";

const getCountry = async () => {
  try {
    const response = await axios.get("https://get.geojs.io/v1/ip/country.json");
    return response.data;
  } catch (error) {
    return "UNKONWN";
  }
};

export default {
  getCountry,
};
