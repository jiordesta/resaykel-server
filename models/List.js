import mongoose from "mongoose";
const ListSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: Array },
});
export default mongoose.model("List", ListSchema);
