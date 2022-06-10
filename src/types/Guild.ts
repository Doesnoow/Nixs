import type { StringMap } from 'i18next';

import type { ClientModules } from './Modules';

interface GuildItem {
  name: string;
  price: number;
  amount: number;
  requirements: {
    roles: string[][] | string[];
    messages: number;
    xp: number;
  }
}

interface Guild {
  _id: string;
  premium: boolean;
  economy: {
    money: number;
    items: GuildItem[];
  }
}

interface GuildUser {
  _id: string;
  user_id: string;
  guild_id: string;
  rank: {
    xp: number;
    level: number;
  },
  money: number;
  items: GuildItem[];
}

interface GuildModule<Values = StringMap> {
  _id: string;
  name: keyof ClientModules;
  guild_id: string;
  values: Values;
  active: boolean;
}

export type {
  GuildModule,
  GuildUser,
  Guild,
};
