import type { NixsClient } from '../client';

import { Loader } from '../structures';

import { MongoDB } from '../database/MongoDB';

export class DatabaseLoader extends Loader {
  private _database!: MongoDB | null;

  constructor(client: NixsClient) {
    super({
      name: 'database',
    }, client);
  }

  async load() {
    try {
      await this._initializeDatabase();

      this.client.database = (this._database) as MongoDB;
      return !!this._database;
    } catch (error) {
      this.client._logger.error(error);
    }

    return false;
  }

  private async _initializeDatabase() {
    this._database = new MongoDB();

    this._database.connect()
      .then(() => this.client._logger.info({ tag: 'DB' }, 'Database connection established'))
      .catch((e) => {
        this.client._logger.error(e);

        this._database = null;
      });
  }
}
