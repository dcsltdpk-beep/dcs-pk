import mongoose, { Schema, Document, Model } from 'mongoose';
import { AdminRole, AdminAction } from '../rbac';

export interface IUserPermission {
  module: string;
  actions: AdminAction[];
}

export interface IUser extends Document {
  name?: string;
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  permissions: IUserPermission[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSubSchema = new Schema<IUserPermission>(
  {
    module: { type: String, required: true },
    actions: [{ type: String }],
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: '' },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'sub_admin'],
      default: 'sub_admin',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    permissions: {
      type: [PermissionSubSchema],
      default: [],
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
