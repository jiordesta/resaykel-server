import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { BadRequestError } from "../utils/custom_errors.js";
import { createJWT } from "../utils/token.js";
import { uploadImage } from "../utils/file_handler.js";
import { count } from "../utils/create.js";

export const signup = async (req, res) => {
  const { name, username, password } = req.body;
  const url = await uploadImage(req, `resaykel/users/${username}`);
  if (!url) throw new BadRequestError("Error uploading the image");
  const user = await User.create({
    name,
    username,
    password: await hashPassword(password),
    image: url,
  });
  if (!user)
    throw new BadRequestError("There was an error creating your account");
  await count("user");
  res.status(StatusCodes.OK).json("");
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new BadRequestError(`Username "${username}" does not exist`);
  if (!(await comparePassword(password, user.password)))
    throw new BadRequestError("Wrong password");
  const token = createJWT({ _id: user._id });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: false, //set true on deployment
  });
  res.status(StatusCodes.OK).json("");
};

export const fetch_user = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new BadRequestError("Invalid Token");
  res.status(StatusCodes.OK).json({ user });
};

export const signout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: false,
  });
  res.status(StatusCodes.OK).json("Logged out");
};
