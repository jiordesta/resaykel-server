import { UnauthenticatedError } from "../utils/custom_errors.js";
import { verifyJWT } from "../utils/token.js";

export const authenticate = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentication invalid");
  try {
    const { _id, role } = verifyJWT(token);
    req.user = { _id, role };
    next();
  } catch (err) {
    if (!token) throw new UnauthenticatedError("authentication invalid");
  }
};
