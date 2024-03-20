import { v4 } from "uuid";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../configs/firebase.js";
import { BadRequestError } from "./custom_errors.js";

export const uploadImage = async ({ file }, path) => {
  if (!file) throw new BadRequestError("Image is Required");
  try {
    const storageRef = ref(storage, `${path}/${v4()}`);
    const metadata = {
      contentType: file.minetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const imageUrl = await getDownloadURL(snapshot.ref);
    return imageUrl;
  } catch (error) {
    throw new BadRequestError(
      "There was an Error uploading your image to the database!"
    );
  }
};
