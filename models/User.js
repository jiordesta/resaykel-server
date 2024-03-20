import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  image: { type: String },
});
export default mongoose.model("User", UserSchema);
