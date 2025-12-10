import { model, Schema } from "mongoose";

const user_contact = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      required: true,
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export const Contacts = model("Contact", user_contact);
export default Contacts;
