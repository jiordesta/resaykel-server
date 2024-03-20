import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { BadRequestError } from "../utils/custom_errors.js";
import { uploadImage } from "../utils/file_handler.js";
import { count, list } from "../utils/create.js";
import List from "../models/List.js";
import Count from "../models/Counter.js";

export const create_product = async (req, res) => {
  const { name, desc, price, category } = req.body;
  const { _id } = req.user;
  const url = await uploadImage(req, `resaykel/products/${name}`);
  if (!url)
    throw new BadRequestError("There was an error in uploading the image");

  const user = await User.findById(_id);
  if (!user) throw new BadRequestError("An error occured creating the product");

  const data = {
    name: name,
    desc: desc,
    price,
    category: {
      label: category,
      value: category.toLowerCase().replace(/\s/g, ""),
    },
    image: url,
    seller: {
      _id,
      name: user.name,
      username: user.username,
    },
  };

  await list("categories", data.category);

  const product = await Product.create(data);
  if (!product) throw new BadRequestError("Error in creating product");
  await count("product");
  res.status(StatusCodes.OK).json("Created");
};

export const fetch_products = async (req, res) => {
  const { name, category } = req.params;

  const nameFilter = name.toLowerCase().replace(/%20/g, "").replace(/\s+/g, "");

  const fetchData = async () => {
    const escapedTerm = nameFilter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regexPattern = new RegExp(escapedTerm.split("").join("\\s*"), "i");
    if (name === "all" && category === "all") {
      return await Product.find({});
    } else if (name !== "all" && category !== "all") {
      return await Product.find({
        name: regexPattern,
        "category.value": category,
      });
    } else if (category === "all") {
      return await Product.find({ name: regexPattern });
    } else if (name === "all") {
      return await Product.find({ "category.value": category });
    } else {
      return [];
    }
  };

  const products = await fetchData();
  const categories = await List.findOne({ name: "categories" });
  const count = await Count.findOne({ name: "product" });

  if (!products) throw new BadRequestError("Error in loading the data");
  res.status(StatusCodes.OK).json({ products, categories, count });
};

export const fetch_my_products = async (req, res) => {
  const { _id } = req.user;
  const products = await Product.find({ "seller._id": _id });

  if (!products)
    throw new BadRequestError("There was an error getting the data");
  const categories = await List.findOne({ name: "categories" });
  const count = await Count.findOne({ name: "product" });
  res.status(StatusCodes.OK).json({ products, categories, count });
};

export const update_product = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);
  if (!product)
    throw new BadRequestError("There was an error updating the product");
  res.status(StatusCodes.OK).json("");
};

export const update_name = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);
  if (!product)
    throw new BadRequestError("There was an error updating the product");
  res.status(StatusCodes.OK).json("");
};

export const update_description = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);
  if (!product)
    throw new BadRequestError("There was an error updating the product");
  res.status(StatusCodes.OK).json("");
};

export const delete_product = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const product = await Product.findOne({ "seller._id": _id, _id: id });
  if (!product)
    throw new BadRequestError("There was an error deleting the product");
  await Product.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json("");
};
