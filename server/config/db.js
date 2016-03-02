var Sequelize = require( 'sequelize' );
var db = new Sequelize('dinnerDaddy', null, null, {
  dialect: 'sqlite',

  define: {
    underscored: true
  },

  storage: './server/config/dinnerDaddy.sqlite'
});

module.exports = db;
