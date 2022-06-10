/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

import { MiscUtils } from '../../utils';

interface BaseModel {
  _id: string;
}

type Filter<Model> = mongoose.FilterQuery<Model>;
type Projection<Model> = mongoose.ProjectionType<Model>;
type UpdateQuery<Model> = mongoose.UpdateQuery<Model>;
type QueryOptions<Model> = mongoose.QueryOptions<Model>;

export class MongoModel<
  IModel extends BaseModel
> {
  private readonly _model!: mongoose.Model<IModel>;

  private readonly _default: IModel[];

  constructor(
    name: string,
    schema: mongoose.Schema<IModel>,
    ...keys: Partial<IModel>[]
  ) {
    this._model = mongoose.model(name, schema);
    this._default = (keys || {}) as IModel[];
  }

  parse(entity: any): IModel;

  parse(entites: any[]): IModel[];

  parse(entity: any | any[]): IModel | IModel[] {
    if (Array.isArray(entity)) return entity.map((e) => this.parse(e));

    return MiscUtils.compareAndReplaceFromArray(
      this._default,
      entity
        ? typeof entity.toJSON === 'function'
          ? entity.toJSON()
          : entity
        : {},
    );
  }

  add(entity: Partial<IModel>): Promise<IModel> {
    return this._model.create(entity).then((data) => this.parse(data));
  }

  // EVERYTHING DOWN THERE
  // NEEDS A UPDATE

  find(filter: Filter<IModel>, projection?: Projection<IModel>): Promise<IModel[]> {
    return this._model.find(filter, projection)
      .then((data) => this.parse(data) as unknown as IModel[]);
  }

  findOne(filter: Filter<IModel>, projection?: Projection<IModel>): Promise<IModel> {
    return this._model.findOne(filter, projection).then((data) => this.parse(data));
  }

  get(id: string, projection?: Projection<IModel>): Promise<IModel> {
    return this.findOne({ _id: id }, projection);
  }

  delete(id: string): Promise<boolean>;

  delete(filter: Filter<IModel>): Promise<boolean>;

  delete(filter: Filter<IModel> | string): Promise<boolean> {
    return this._model.deleteOne(
      typeof filter === 'string'
        ? { _id: filter }
        : filter,
    ).then((data) => data.deletedCount > 0);
  }

  deleteMany(filter: Filter<IModel>): Promise<boolean> {
    return this._model.deleteMany(filter).then((data) => data.deletedCount > 0);
  }

  update(
    id: string,
    entity: UpdateQuery<IModel>,
    options?: QueryOptions<IModel>,
  ): Promise<IModel>;

  update(
    filter: Filter<IModel>,
    entity: UpdateQuery<IModel>,
    options?: QueryOptions<IModel>,
  ): Promise<IModel>;

  update(
    filterOrId: Filter<IModel> | string,
    entity: UpdateQuery<IModel>,
    options: QueryOptions<IModel> = { upsert: true },
  ): Promise<IModel> {
    return this._model.findOneAndUpdate(
      typeof filterOrId === 'string'
        ? { _id: filterOrId }
        : filterOrId,
      entity,
      options,
    ).then((data) => this.parse(data));
  }
}
