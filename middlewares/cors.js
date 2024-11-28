import _cors from "cors";

const cors = () => {
  return _cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
  });
};

export default cors();
