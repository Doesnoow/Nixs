import { Intents } from 'discord.js';

import { Client } from 'discordx';
import { importx } from '@discordx/importer';

import path from 'path';

import type { i18n } from 'i18next';

import configs from '../configs';

import type { Modules, Services } from '../types';
import type { MongoDB } from '../database';

import type { Loader } from '../structures';
import { Container, Cache } from '../structures';

import _loaders from '../loaders';

import { Logger } from '../utils/logger';

import '../types/discord.js';

export class NixsClient extends Client {
  modules: Container<Modules.ClientModules> = new Container();

  services: Container<Services.ClientServices> = new Container();

  i18n!: i18n;

  database!: MongoDB;

  readonly _logger: Logger = new Logger();

  readonly cache: Cache = new Cache(600);

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
      silent: !configs.debug,
      botGuilds: configs.debug
        ? configs.TEST_GUILDS_IDS
        : undefined,
    });
  }

  async start() {
    const loaders: Loader[] = Object.values(_loaders).map((_Loader) => new _Loader(this));

    const preLoad: Loader[] = loaders.filter((loader) => loader.preload);
    const normalLoad: Loader[] = loaders.filter((loader) => !loader.preload);

    preLoad.forEach((loader) => this._initializeLoader(loader));

    await importx(path.join(__dirname, '..', '/{listeners,commands}/**/*{ts,js}'));
    await this.login();

    normalLoad.forEach((loader) => this._initializeLoader(loader));
  }

  override login() {
    return super.login(
      configs.debug
        ? configs.DEV_TOKEN
        : configs.TOKEN,
      configs.debug,
    );
  }

  private async _initializeLoader(loader: Loader) {
    let success: boolean = false;

    try {
      success = await loader.load(this);
    } catch (e) {
      this._logger.error(e);
    } finally {
      this._logger.info({ tag: 'Loaders' }, `loaded ${loader.name} loader`);
      if (!success && loader.critical) process.exit(1);
    }
  }
}
