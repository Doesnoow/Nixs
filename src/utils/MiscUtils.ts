import type { StringMap } from 'i18next';

type PartialKeys<T> = {
  [key in keyof T]?: Partial<T[key]>;
}

export class MiscUtils {
  static isEqual(obj1: object, obj2: object, strict: boolean = false) {
    return strict
      ? Object.is(obj1, obj2)
      : Object.entries(obj1).toString() === Object.entries(obj2).toString();
  }

  static compareAndReplace<T extends StringMap>(obj1: T, obj2: T): T {
    const value = Object.keys(obj2).map((key: keyof T) => ({
      // checking if obj1[key] exists
      [key]: typeof obj1[key] === 'undefined'
        // in case not, just keep the obj2 value
        ? obj2[key]
        // checks if obj2[key] is an object and
        // and both obj1 and obj2 have the same keys
        // e.g:
        // obj1: { a, b }
        // obj2: { a, b }
        : typeof obj2[key] === 'object' && !MiscUtils.isEqual(obj1, obj2)
          // if they doesn't have the same keys and obj2[key] is an object
          // then check the keys inside that object
          ? MiscUtils.compareAndReplace(obj1[key], obj2[key])
          // otherwise just keep that value
          : obj1[key],
    }));

    return MiscUtils.arrayToObject(value) as unknown as T;
  }

  static compareAndReplaceFromArray<T extends StringMap, K extends object[] = PartialKeys<T>[]>(
    obj1: K,
    obj2: T,
  ) {
    // IDK WHAT'S GOING ON
    // THAT JUST WORKS

    const result = obj1.map((obj) => MiscUtils.compareAndReplace(obj2, obj));

    return MiscUtils.arrayToObject(result) as T;
  }

  static arrayToObject<T extends object>(arr: T[]): T {
    return arr.reduce((p, v) => ({ ...v, ...p }), {}) as T;
  }
}
