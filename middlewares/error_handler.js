import { StatusCodes } from "http-status-codes";

export const error_handler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong!";
  res.status(statusCode).json({ message: message });
};
