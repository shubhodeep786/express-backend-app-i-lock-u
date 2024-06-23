const { sequelize } = require('./models');

sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
