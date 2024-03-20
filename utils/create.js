import Counter from "../models/Counter.js";
import List from "../models/List.js";
import { BadRequestError } from "./custom_errors.js";

export const count = async (name) => {
  try {
    const counter = await Counter.findOne({ name });
    if (counter) {
      const value = counter.value + 1;
      const updated = await Counter.findByIdAndUpdate(counter._id, { value });
      if (!updated) throw new BadRequestError("There was an error in counter");
    } else {
      const new_counter = await Counter.create({ name });
      if (!new_counter)
        throw new BadRequestError("There was an error creating a counter");
    }
    return;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const list = async (name, new_val) => {
  try {
    const list = await List.findOne({ name });
    if (list) {
      if (list.value.includes(new_val)) {
        return;
      }
      const value = [...list.value, new_val];
      const updated = await List.findByIdAndUpdate(list._id, { value });
      if (!updated) throw new BadRequestError("There was an error in counter");
    } else {
      const new_list = await List.create({
        name,
        value: [new_val, { label: "All", value: "all" }],
      });
      if (!new_list)
        throw new BadRequestError("There was an error creating a counter");
    }
    return;
  } catch (error) {
    throw new BadRequestError(error);
  }
};
