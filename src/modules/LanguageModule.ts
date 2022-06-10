import type { NixsClient } from '../client';
import type { LanguageModuleValues } from '../types/Modules';

import { Module } from '../structures';

export class LanguageModule extends Module<LanguageModuleValues> {
  constructor(client: NixsClient) {
    super({
      name: 'language',
      toggleable: false,
      defaultValues: { language: 'en-US' },
    }, client);
  }
}
