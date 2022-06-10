import type { User } from 'discord.js';

import type { NixsClient } from '../client';

import { Service } from '../structures';

import { UserModel } from '../models/User';

export class UserService extends Service {
  constructor(client: NixsClient) {
    super('user', client);
  }

  get(id: string) {
    return UserModel.get(id);
  }

  async isBlacklisted(id: string): Promise<boolean> {
    const blacklist = await UserModel.findOne({ _id: id }, 'blacklisted');

    return !!blacklist.blacklisted;
  }

  setBlacklist(blacklisted: User, blacklister: User | string, reason: string) {
    return UserModel.update(
      blacklisted.id,
      {
        $set: {
          blacklister: typeof blacklister === 'string' ? blacklisted : blacklister.id,
          reason,
        },
      },
    );
  }
}
