import { Router } from "express";
import {
  fetch_user,
  signin,
  signout,
  signup,
} from "../controllers/user_controller.js";
import { upload } from "../middlewares/multer.js";
import {
  validate_signin,
  validate_signup,
} from "../middlewares/input_validator.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.route("/signup").post(upload.single("image"), validate_signup, signup);
router.route("/signin").post(upload.single(""), validate_signin, signin);
router.route("/fetch_user").get(authenticate, fetch_user);
router.route("/signout").post(authenticate, signout);

export default router;
