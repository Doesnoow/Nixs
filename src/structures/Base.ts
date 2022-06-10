import type { NixsClient } from '../client';

interface BaseOptions<T> {
  name: T;
}

export abstract class BaseStructure<T = string> {
  readonly name: T;

  readonly client: NixsClient;

  constructor(options: BaseOptions<T>, client: NixsClient) {
    this.name = options.name;

    this.client = client;
  }
}
