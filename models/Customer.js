import { Schema, model, models } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    memberNumber: { type: Number, required: true, min: 1, index: true },
    interests: { type: String, default: "", trim: true } 
  },
  { timestamps: true }
);

export default models.customer || model("customer", CustomerSchema);
