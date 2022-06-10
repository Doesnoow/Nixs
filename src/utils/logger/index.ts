import type { Logger as PinoLogger } from 'pino';
import _pino from 'pino';

import configs from '../../configs';

export class Logger {
  private _pino: PinoLogger;

  constructor() {
    const level = configs.debug ? 'trace' : 'info';

    this._pino = _pino({
      name: 'Nixs',
      level,
    });
  }

  fatal(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.fatal(obj, msg, args);
  }

  error(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.error(obj, msg, args);
  }

  warn(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.warn(obj, msg, args);
  }

  info(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.info(obj, msg, args);
  }

  debug(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.debug(obj, msg, args);
  }

  trace(obj: any | string, msg?: string, ...args: any[]) {
    this._pino.trace(obj, msg, args);
  }
}
