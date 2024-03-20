import { origins } from "./origins.js";

export const cors_options = {
  origin: (origin, callback) => {
    if (origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS!"));
    }
  },
  credentials: true,
  optionSuccessStatus: true,
};
