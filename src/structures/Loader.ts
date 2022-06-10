import type { NixsClient } from '../client';

import { BaseStructure } from './Base';

interface ILoaderOptions {
  name: string;
  critical?: boolean;
  preload?: boolean;
}

export class Loader extends BaseStructure {
  critical: boolean;

  preload: boolean;

  constructor(options: ILoaderOptions, client: NixsClient) {
    super({
      name: options.name,
    }, client);

    this.preload = !!options.preload;
    this.critical = !!options.critical;
  }

  canLoad() {
    return true;
  }

  // eslint-disable-next-line no-unused-vars
  load(client: NixsClient): Promise<boolean> | boolean {
    throw new Error(`Missing loader function in ${this.name} loader`);
  }
}
