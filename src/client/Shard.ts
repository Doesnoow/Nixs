import { ShardingManager } from 'discord.js';

import configs from '../configs';

class Sharding {
  static start() {
    const manager = new ShardingManager('./dist/Main.js', {
      token: configs.debug ? configs.DEV_TOKEN : configs.TOKEN,
    });

    manager.on('shardCreate', (shard) => {
      console.log(`Launched shard #${shard.id}`);
    }).spawn();

    return manager;
  }
}

Sharding.start();
