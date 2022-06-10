import type { NixsClient } from '../client';

import { Loader, Module } from '../structures';

import { FileUtils } from '../utils';

interface ModuleChildren {
  // eslint-disable-next-line no-unused-vars
  new (client: NixsClient): any;
}

export class ModuleLoader extends Loader {
  constructor(client: NixsClient) {
    super({
      name: 'module',
      critical: true,
    }, client);
  }

  get container() {
    return this.client.modules;
  }

  async load(client: NixsClient) {
    try {
      await this._initializeModules(client);

      return true;
    } catch (error) {
      this.client._logger.error(error);
    }

    return false;
  }

  private _initializeModules(client: NixsClient) {
    return FileUtils.requireDirectory(
      '/modules',
      (file) => {
        const modules = FileUtils.getFromFile<ModuleChildren>(file, Module);

        modules.forEach((_Module) => {
          const mod = new _Module(client);

          this.container.set(mod.name, mod);
        });
      },
      this.client._logger.error,
    );
  }
}
