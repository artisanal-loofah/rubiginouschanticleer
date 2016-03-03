var db = require('../config/db');
var Sequelize = require('sequelize');
var User = require('../users/users');

var Session = db.define('sessions', {
  sessionName : Sequelize.STRING,
  sessionLocation : Sequelize.STRING
});
// This is the join table connecting User and Session
// We get a lot of Sequelize methods for free by using
// belongsToMany (see http://docs.sequelizejs.com/en/latest/docs/associations/?highlight=belongsToMany)
var UserSession = db.define('user_sessions', {});
Session.belongsToMany(User, {through: UserSession});
User.belongsToMany(Session, {through: UserSession});

UserSession.sync();
Session.sync();
User.sync();


module.exports = Session;
