import { Router } from "express";
import {
  checkout,
  create_product,
  delete_product,
  fetch_my_products,
  fetch_products,
  update_description,
  update_name,
  update_product,
} from "../controllers/product_controller.js";
import { upload } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  validate_create_product,
  validate_update_product_description,
  validate_update_product_name,
} from "../middlewares/input_validator.js";

const router = Router();

router
  .route("/create_product")
  .post(
    upload.single("image"),
    validate_create_product,
    authenticate,
    create_product
  );

router
  .route("/fetch_products/:category/:name")
  .get(upload.single(""), authenticate, fetch_products);

router.route("/fetch_my_products").get(authenticate, fetch_my_products);
router
  .route("/update_product/:id")
  .patch(
    authenticate,
    upload.single(""),
    validate_create_product,
    update_product
  );

router
  .route("/update_product/name/:id")
  .patch(
    authenticate,
    upload.single(""),
    validate_update_product_name,
    update_name
  );
router
  .route("/update_product/description/:id")
  .patch(
    authenticate,
    upload.single(""),
    validate_update_product_description,
    update_description
  );

router.route("/delete_product/:id").delete(authenticate, delete_product);

router.route("/checkout/:items").patch(authenticate, checkout);

export default router;
