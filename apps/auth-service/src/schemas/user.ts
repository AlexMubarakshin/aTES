import mongoose from "mongoose";
import {POPUG_ROLES} from "popug-shared";

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true, required: true},
  publicId: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  role: {type: String, enum: Object.values(POPUG_ROLES), required: true, default: POPUG_ROLES.regular}
});

export const User = mongoose.model('User', userSchema);
