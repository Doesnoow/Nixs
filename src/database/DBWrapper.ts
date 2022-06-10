/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */

export abstract class DBWrapper {
  connected: boolean = false;

  // eslint-disable-next-line no-unused-vars
  constructor(readonly options: object) {}

  connect() {
    throw new Error(`Missing connect function in ${this.constructor.name} wrapper.`);
  }
}
