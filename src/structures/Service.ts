import type { NixsClient } from '../client';
import type { Services } from '../types';

import { BaseStructure } from './Base';

type ServiceNames = keyof Services.ClientServices;

export abstract class Service extends BaseStructure<ServiceNames> {
  constructor(serviceName: ServiceNames, client: NixsClient) {
    super({
      name: serviceName,
    }, client);
  }

  get cache() {
    return this.client.cache;
  }
}
