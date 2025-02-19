import { ObjectId } from 'mongoose';

export interface UserInterface extends Document {
  _id: ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  userName?: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
  mobile?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isDeleted?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
