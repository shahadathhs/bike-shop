import { Document } from "mongoose";

export type TRole = 'admin' | 'customer';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: TRole;
  accountCreatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  updatePassword(newPassword: string): Promise<void>;
  toProfileJSON(): { id: string; name: string; email: string; role: TRole; password: string };
  isAdmin(): boolean;
  findByEmail(email: string): Promise<IUser | null>;
}