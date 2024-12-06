const isDev = process.env.NODE_ENV != "production";
const PRODUCTION_SERVER_DOMAIN = process.env.PRODUCTION_SERVER_DOMAIN;
const SEIN_BASE_URL = process.env.SEIN_BASE_URL;

export default {
  SEIN_BASE_URL: SEIN_BASE_URL,
  SERVER_DOMAIN: isDev
    ? "http://localhost:3001/api"
    : PRODUCTION_SERVER_DOMAIN + "/api",
};
