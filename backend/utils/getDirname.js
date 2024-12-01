import { fileURLToPath } from "url";
import { dirname } from "path";

const getDirname = (url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  return __dirname;
};

export default getDirname;
