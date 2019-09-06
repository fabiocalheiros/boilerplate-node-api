import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connnection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connnection))
      .map(
        model => model.associate && model.associate(this.connnection.models)
      );
  }
}

export default new Database();
