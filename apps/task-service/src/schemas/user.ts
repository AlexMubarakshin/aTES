import mongoose from 'mongoose';
import {POPUG_ROLES} from "popug-shared";

const userSchema = new mongoose.Schema({
  publicId: {type: String, required: true},
  email: {type: String, required: true},
  role: {type: String, enum: Object.values(POPUG_ROLES), required: true}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

export const User = mongoose.model('user', userSchema);

