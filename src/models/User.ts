import mongoose from 'mongoose';

import { MongoModel, Constants } from './base';

import { UserData, UserLogData } from '../types/User';

const UserSchema = new mongoose.Schema({
  _id: String,
  // money: Number,
  blacklisted: {
    reason: String,
    blacklister: String,
  },
});

// const UserYitSchema = new mongoose.Schema({
//   token_id: String,
//   code: String,
//   price: Number,
//   date: Number,
// });

const UserLogSchema = new mongoose.Schema({
  user_id: String,
  subject: {
    tag: String,
    id: String,
  },
  amount: Number,
  date: Number,
});

export const UserModel = new MongoModel<UserData>('User', UserSchema, Constants.USER_DEFAULT);
export const UserLogModel = new MongoModel<UserLogData>('UserLogs', UserLogSchema);
// export const UserYitModel = new MongoModel('UserYit', UserYitSchema);
