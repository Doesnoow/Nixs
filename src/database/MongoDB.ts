import mongoose from 'mongoose';

import configs from '../configs';

import { DBWrapper } from './DBWrapper';

export class MongoDB extends DBWrapper {
  constructor(options: mongoose.ConnectOptions = {}) {
    super(options);
  }

  connect() {
    return mongoose.connect(configs.MONGOOSE_URI, this.options)
      .then(() => {
        this.connected = true;
      });
  }
}
