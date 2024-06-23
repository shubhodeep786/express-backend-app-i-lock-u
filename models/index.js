'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models dynamically
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define the User model
const User = sequelize.define('User', {
  UserID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: Sequelize.STRING,
  Email: Sequelize.STRING,
  PhoneNumber: Sequelize.STRING,
  LoginPIN: Sequelize.STRING,
  DateOfBirth: Sequelize.DATEONLY,
  AadhaarNumber: Sequelize.STRING,
  PANNumber: Sequelize.STRING,
  UserImage: Sequelize.BLOB,
});

// Define the DID model
const DID = sequelize.define('DID', {
  ID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  Controller: Sequelize.STRING,
  Created: Sequelize.DATE,
  Updated: Sequelize.DATE,
  DIDDocument: Sequelize.TEXT,
});

// Define the Resource model
const Resource = sequelize.define('Resource', {
  ResourceID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  Payload: Sequelize.TEXT,
});

// Define the Document model
const Document = sequelize.define('Document', {
  DocumentID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Content: Sequelize.BLOB,
  Created: Sequelize.DATE,
  Updated: Sequelize.DATE,
});

// Define the DocumentTransaction model
const DocumentTransaction = sequelize.define('DocumentTransaction', {
  TransactionID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TransactionData: Sequelize.JSONB,
});

// Define associations
User.hasMany(Document, { foreignKey: 'OwnerID' });
Document.belongsTo(User, { foreignKey: 'OwnerID' });

DID.hasMany(Resource, { foreignKey: 'DIDID' });
Resource.belongsTo(DID, { foreignKey: 'DIDID' });

Document.hasMany(DocumentTransaction, { foreignKey: 'DocumentID' });
DocumentTransaction.belongsTo(Document, { foreignKey: 'DocumentID' });

// Add models to the db object
db.User = User;
db.DID = DID;
db.Resource = Resource;
db.Document = Document;
db.DocumentTransaction = DocumentTransaction;

// Export the db object with Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
