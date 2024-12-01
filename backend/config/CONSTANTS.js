const isDev = process.env.NODE_ENV != "production";
const PRODUCTION_SERVER_DOMAIN = process.env.PRODUCTION_SERVER_DOMAIN;

export default {
  SERVER_DOMAIN: isDev ? "http://localhost:3001" : PRODUCTION_SERVER_DOMAIN,
  SEIN_BASE_URL: isDev
    ? "https://testdomain5564sd.com/api"
    : "https://testdomain5564sd.com/api",
};
