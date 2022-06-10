/* eslint-disable no-unused-vars */
import type mongoose from 'mongoose';
import type { StringMap } from 'i18next';

import type { NixsClient } from '../client';
import type { GuildModule as _GuildModule } from '../types/Guild';
import type { ClientModules } from '../types/Modules';

import { BaseStructure } from './Base';

import type { MongoModel } from '../models/base';
import { GuildModuleModel } from '../models/Guild';

import { MiscUtils } from '../utils';

interface ModuleOptions<ModuleValues> {
  name: keyof ClientModules;
  toggleable?: boolean;
  defaultState?: boolean;
  defaultValues?: ModuleValues;
}

type GuildModule<ModuleValues> = Omit<_GuildModule<ModuleValues>, '_id'> & { '_id'?: string };

export abstract class Module<
  ModuleValues extends StringMap
> extends BaseStructure<keyof ClientModules> {
  readonly toggleable: boolean;

  defaultState: boolean;

  defaultValues: ModuleValues;

  constructor(options: ModuleOptions<ModuleValues>, client: NixsClient) {
    super({
      name: options.name,
    }, client);

    this.toggleable = options.toggleable ?? true;
    this.defaultState = options.defaultState ?? true;
    this.defaultValues = options.defaultValues ?? {} as ModuleValues;
  }

  private get _modules(): MongoModel<_GuildModule<ModuleValues>> {
    return GuildModuleModel as MongoModel<_GuildModule<ModuleValues>>;
  }

  validateState(state: any) {
    return this.toggleable
      ? typeof state !== 'boolean'
        ? this.defaultState
        : state
      : true;
  }

  parse(entities: Partial<GuildModule<ModuleValues>> | any): GuildModule<ModuleValues>;

  // eslint-disable-next-line no-dupe-class-members
  parse(entity: Partial<GuildModule<ModuleValues>>[] | any[]): GuildModule<ModuleValues>[];

  parse(entities: any) {
    if (Array.isArray(entities)) return entities.map((entity) => this.parse(entity));

    return {
      name: this.name,
      active: this.defaultState ?? true,
      ...(entities || {}),
      values: {
        ...this.defaultValues,
        ...(entities && entities.values ? entities.values : {}),
      },
    };
  }

  // Retrievers
  isActive(guildID: string): Promise<boolean> {
    if (!this.client.database || !this.toggleable) return Promise.resolve(this.defaultState);

    return this._get(guildID, 'active').then((mod) => (
      this.toggleable
        ? mod
          ? mod.active
          : this.defaultState
        : true
    ));
  }

  retrieve(guildID: string, projection: string = 'active values'): Promise<GuildModule<ModuleValues>> {
    if (!this.client.database) {
      return Promise.resolve({
        active: this.defaultState,
        values: this.defaultValues,
        name: this.name,
        guild_id: guildID,
      });
    }

    return this._get(guildID, projection);
  }

  retrieveValue<V extends keyof ModuleValues>(guildID: string, value: V) {
    if (!this.client.database) return this.defaultValues[value];

    return this.asJSON(guildID, `values.${String(value)}`)
      .then((mod) => mod.values[value]);
  }

  retrieveValues(guildID: string, values: string): Promise<ModuleValues> {
    if (!this.client.database) return Promise.resolve(this.defaultValues);

    return this.asJSON(
      guildID,
      values.split(' ').map((value) => `values.${value}`).join(' '),
    ).then((mod) => mod.values);
  }

  async asJSON(
    guildID: string,
    projection: string,
  ): Promise<GuildModule<ModuleValues> & { toggleable: boolean }> {
    const mod = await this.retrieve(guildID, projection);

    return {
      toggleable: this.toggleable,
      ...this.parse(mod || {}),
    };
  }

  // Updaters
  updateValues(guildID: string, values: Partial<ModuleValues>): Promise<boolean> {
    if (!this.client.database) return Promise.resolve(false);

    const pathFor = (key: string) => `values.${key}`;
    const dbObj: mongoose.UpdateQuery<any> = {};

    Object.entries(values).forEach(([key, value]) => {
      if (MiscUtils.isEqual(this.defaultValues, value)) {
        if (!dbObj.$unset) dbObj.$unset = {};

        dbObj.$unset[pathFor(key)] = value;
      } else {
        if (!dbObj.$set) dbObj.$set = {};

        dbObj.$set[pathFor(key)] = value;
      }
    });

    return this._update(guildID, dbObj).then((data) => !!data);
  }

  updateState(guildID: string, state: boolean): Promise<boolean> {
    if (!this.client.database || !this.toggleable) return Promise.resolve(false);

    return this._update(guildID, {
      active: state,
    }).then((data) => !!data);
  }

  private _update(guildID: string, entity: mongoose.UpdateQuery<GuildModule<ModuleValues>>) {
    return this._modules.update({ guild_id: guildID, name: this.name }, entity, { upsert: true });
  }

  private _get(guildID: string, projection?: string) {
    return this._modules.findOne({ name: this.name, guild_id: guildID }, projection);
  }
}
