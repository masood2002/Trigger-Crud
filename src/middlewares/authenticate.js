const checkAuth = async (req, res, next) => {
  if (!req.headers["auth"]) {
    return res.status(404).send({ error: req.__("authMissing") });
  }

  if (req.headers["auth"] === process.env.auth) {
    next();
  } else {
    return res.status(403).send({ error: req.__("authInvalid") });
  }
};

export default checkAuth;
