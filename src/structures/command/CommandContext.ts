import type {
  TFunction,
  TFunctionKeys,
  TOptions,
} from 'i18next';

import type { UserService } from '../../services/UserService';
import type { GuildService } from '../../services/GuildService';

import type { NixsClient } from '../../client';

interface CommandContextOptions {
  language: string;
}

export class CommandContext {
  private readonly client: NixsClient;

  user: UserService;

  guild: GuildService;

  language: string;

  t: TFunction;

  constructor(options: CommandContextOptions, client: NixsClient) {
    this.client = client;

    this.user = client.services.get('user');
    this.guild = client.services.get('guild');

    this.language = options.language;

    this.t = client.i18n.getFixedT(this.language);
  }

  setFixedT(translate: TFunction | string): this {
    if (typeof translate === 'string') {
      return this.setFixedT(this.client.i18n.getFixedT(translate));
    }

    this.t = (key: TFunctionKeys, options?: string | TOptions) => translate([key, 'key.not_found'], options);
    return this;
  }
}
