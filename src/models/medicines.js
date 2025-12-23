import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    S_NO: {
      type: Number,
      required: true,
      unique: true,
    },
    PRODUCT: {
      type: String,
      required: true,
      trim: true,
    },
    MG_VALUE: {
      type: String,
      required: true,
    },
    MEDICINE_TYPE: {
      type: String,
      required: true,
      enum: ["Tablet", "Capsule"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Medicine = model("Medicine", medicineSchema);
export default Medicine;
