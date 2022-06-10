import mongoose from 'mongoose';

import { MongoModel, Constants } from './base';

import type { Guild, GuildModule, GuildUser } from '../types/Guild';

const GuildSchema = new mongoose.Schema({
  _id: String,
  premium: Boolean,
  economy: {
    money: Number,
    items: Array,
  },
});

const GuildUserSchema = new mongoose.Schema({
  user_id: String,
  guild_id: String,
  rank: {
    level: Number,
    xp: Number,
  },
  money: Number,
  items: Array,
});

const GuildModuleSchema = new mongoose.Schema({
  guild_id: String,
  name: String,
  active: Boolean,
  values: Object,
});

export const GuildModel = new MongoModel<Guild>('Guild', GuildSchema, Constants.GUILD_DEFAULT);
export const GuildUserModel = new MongoModel<GuildUser>('GuildUser', GuildUserSchema, Constants.GUILD_USER_DEFAULT);
export const GuildModuleModel = new MongoModel<GuildModule>('GuildModule', GuildModuleSchema, Constants.GUILD_MODULES_DEFAULT);
