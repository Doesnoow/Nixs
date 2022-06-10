/* eslint-disable no-unused-vars */

// SOURCE
// https://github.com/SwitchbladeBot/switchblade/blob/dev/src/utils/FileUtils.js

import fs from 'fs';
import path from 'path';

import { promisify } from 'util';

interface FileObject<File> {
  [key: string]: File;
}

export class FileUtils {
  static readFile = promisify(fs.readFile);

  static readdir = promisify(fs.readdir);

  static stat = promisify(fs.stat);

  static async requireDirectory<File = any>(
    dir: string,
    success?: (
      file: File,
      fileName: string,
      folder: string
    ) => void | Promise<void>,
    error?: (e: Error) => void | Promise<void>,
    recursive: boolean = true,
    folder: string = '',
  ): Promise<void | FileObject<File>> {
    const files: string[] = await FileUtils.readdir(`${__dirname}/../${dir}`);
    const filesObject: FileObject<File> = {};

    // eslint-disable-next-line consistent-return
    return Promise.all(files.map(async (file) => {
      const fullPath = path.join(__dirname, '..', dir, file);

      if (file.match(/\.(ts|js|json)$/)) {
        try {
          const required = await import(fullPath);

          if (success) await success(required, file, folder);
          Object.defineProperty(required, file, {});

          return required;
        } catch (e) {
          if (error) return error(e as Error);
        }
      } else if (recursive) {
        const isDirectory = await FileUtils.stat(fullPath).then((_file) => _file.isDirectory());
        if (isDirectory) {
          return FileUtils.requireDirectory(
            path.join(dir, file),
            success,
            error,
            recursive,
            file,
          );
        }
      }
    }))
      .then(() => filesObject)
      .catch(error);
  }

  static getFromFile<T extends Function>(file: FileObject<any>, instance: any): T[] {
    const instances: T[] = [];

    Object.keys(file).forEach((key) => {
      const maybeInstance = file[key];
      if (maybeInstance.prototype instanceof instance) {
        instances.push(maybeInstance);
      }
    });

    return instances;
  }
}
