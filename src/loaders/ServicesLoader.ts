import type { NixsClient } from '../client';

import { FileUtils } from '../utils';

import { Service, Loader } from '../structures';

interface ServiceChildren {
  // eslint-disable-next-line no-unused-vars
  new (client: NixsClient): any;
}

export class ServiceLoader extends Loader {
  constructor(client: NixsClient) {
    super({
      name: 'service',
      critical: true,
    }, client);
  }

  get container() {
    return this.client.services;
  }

  async load(client: NixsClient) {
    try {
      await this._initializeServices(client);

      return true;
    } catch (error) {
      this.client._logger.error(error);
    }

    return false;
  }

  private _initializeServices(client: NixsClient) {
    return FileUtils.requireDirectory(
      '/services',
      (file) => {
        const services = FileUtils.getFromFile<ServiceChildren>(file, Service);

        services.forEach((_Service) => {
          const service = new _Service(client);

          this.container.set(service.name, service);
        });
      },
      this.client._logger.error,
    );
  }
}
