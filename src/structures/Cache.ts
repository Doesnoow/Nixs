import NodeCache from 'node-cache';

export class Cache<V = any> {
  private readonly _cache: NodeCache;

  constructor(ttl: number) {
    this._cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: ttl * 0.2,
      useClones: false,
    });
  }

  get(key: string): V | null | undefined {
    return this._cache.get(key);
  }

  set(key: string, value: V) {
    return this._cache.set<V>(key, value);
  }

  delete(keys: string | string[]) {
    return this._cache.del(keys);
  }

  deleteStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this._cache.keys();
    keys.forEach((key) => {
      if (key.indexOf(startStr) === 0) {
        this.delete(key);
      }
    });
  }

  flush() {
    return this._cache.flushAll();
  }
}
