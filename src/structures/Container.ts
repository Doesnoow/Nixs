export class Container<T extends {} = {}> {
  private _content: T = {} as T;

  get<K extends keyof T>(key: K): T[K] {
    return this._content[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): this {
    this._content[key] = value;

    return this;
  }

  keys(): (keyof T)[] {
    return Object.keys(this._content) as (keyof T)[];
  }

  values(): T[keyof T][] {
    return Object.values(this._content) as T[keyof T][];
  }

  // eslint-disable-next-line no-unused-vars
  forEach(callback: (value: T[keyof T], index: number) => void | Promise<void>) {
    return this.values().forEach(callback);
  }
}
