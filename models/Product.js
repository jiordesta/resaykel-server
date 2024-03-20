import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String },
  desc: { type: String },
  image: { type: String },
  price: { type: Number, default: 0 },
  seller: { type: Object },
  category: { type: Object, default: { label: "Any", value: "any" } },
});
export default mongoose.model("Product", ProductSchema);
