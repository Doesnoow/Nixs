import i18next from 'i18next';

import type { NixsClient } from '../client';

import configs from '../configs';

import { FileUtils } from '../utils';
import { Loader } from '../structures';

export class LanguageLoader extends Loader {
  constructor(client: NixsClient) {
    super({
      name: 'language',
      critical: true,
      preload: true,
    }, client);
  }

  async load() {
    try {
      await i18next
        .init({
          lng: 'en-US',
          fallbackLng: 'en-US',
          supportedLngs: ['en', 'en-US', 'pt', 'pt-BR'],

          ns: ['command', 'errors', 'game', 'modules', 'localization'],
          defaultNS: 'command',
          fallbackNS: 'errors',

          debug: configs.debug,
          interpolation: { escapeValue: false, skipOnVariables: false },
        });
      await this._registerLanguages();

      this.client.i18n = i18next;
      return true;
    } catch (e) {
      this.client._logger.error(e);
    }

    return false;
  }

  private async _registerLanguages() {
    return FileUtils.requireDirectory('/locales', (file, namespace, language) => {
      i18next.addResourceBundle(language, namespace.split('.')[0], file);
    });
  }
}
