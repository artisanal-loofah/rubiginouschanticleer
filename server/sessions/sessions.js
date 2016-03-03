var db = require('../config/db');
var Sequelize = require('sequelize');
var User = require('../users/users');

var Session = db.define('sessions', {
  sessionName : Sequelize.STRING
});

var UserSession = db.define('user_sessions', {});
Session.belongsToMany(User, {through: UserSession});
User.belongsToMany(Session, {through: UserSession});

UserSession.sync();
Session.sync();
User.sync();


module.exports = Session;
