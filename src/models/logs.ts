// src/models/Log.ts
import  { Schema, Document, models, model } from "mongoose";

export interface ILog extends Document {
  action: string;
  timestamp: Date;
}

const logSchema: Schema<ILog> = new Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// export const Log = mongoose.model<ILog>("Log", logSchema);

export const Log =
  models.Log || model<ILog>("Log", logSchema);
