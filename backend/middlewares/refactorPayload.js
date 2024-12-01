const refactorPayload = (req, res, next) => {
  const payload = req.body;
  const chain = payload.chain;
  payload["chain"] = {
    ...chain,
    id: chain.chainId,
    hexId: chain.chainHexId,
    symbol: chain.tokenSymbol,
    name: chain.chainName,
  };

  req.body = { ...req.body, ...payload };

  next();
};

export default refactorPayload;
