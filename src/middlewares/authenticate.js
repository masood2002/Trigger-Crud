import { errorResponse } from "../resources/index.js";
export const checkAuth = async (req, res, next) => {
  if (!req.headers["auth"]) {
    return res.status(404).json(errorResponse(req.__("authMissing")));
  }

  if (req.headers["auth"] === process.env.auth) {
    next();
  } else {
    return res.status(404).json(errorResponse(req.__("authInvalid")));
  }
};
