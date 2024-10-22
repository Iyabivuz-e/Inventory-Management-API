import { Schema, Document, models, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  quantity: number;
  category: string;
}

const productSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
});

// Check if the model already exists to prevent OverwriteModelError
export const Product =
  models.Product || model<IProduct>("Product", productSchema);
