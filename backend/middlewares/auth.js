const auth = async (req, res, next) => {
  const user = req.headers["user-data"];
  if (!user) return res.status(401).send("Unauthorized");
  try {
    req.user = JSON.parse(atob(user));
    next();
  } catch (error) {
    console.log("error");
    res.send("Unauthorzied");
  }
};

export default auth;
