import validator from 'validator';

import type { NixsClient } from '../client';

import { Service } from '../structures';

export class GuildService extends Service {
  constructor(client: NixsClient) {
    super('guild', client);
  }

  private get _language() {
    return this.client.modules.get('language');
  }

  async getGuildLanguage(id: string): Promise<string> {
    const cachedLanguage = await this.cache.get(`modules.language.${id}`);
    if (cachedLanguage) return cachedLanguage;

    const language = await this._language.retrieveValue(id, 'language');
    return this._setToCache(`modules.language.${id}`, language);
  }

  async setGuildLanguage(id: string, language: string) {
    const cachedLanguage = await this.cache.get(`modules.language.${id}`);
    if (validator.equals(`${cachedLanguage}`, language)) return false;

    this._setToCache(`modules.language.${id}`, language);
    return this._language.updateValues(id, { language });
  }

  private async _setToCache(key: string, value: any) {
    this.cache.set(key, value);

    return value;
  }
}
