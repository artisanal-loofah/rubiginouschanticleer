var helpers = require('../config/helpers');
var Session = require('./sessions');
var User = require('../users/users');

module.exports = {

  getAllSessions: function(req, res, next) {
    User.find({where: {id: req.user.id}})
    .then(function(user) {
      return user.getSessions();
    })
    .then(function(sessions) {
      res.json(sessions);
    })
    .catch(function(err) {
      helpers.errorHandler(err, req, res, next);
    });
  },

  addSession: function(req, res, next) {
    var sessionName = req.body.sessionName;
    var sessionLocation = req.body.sessionLocation;

    Session.create({
      sessionName: sessionName,
      sessionLocation: sessionLocation
    }).then(function(session) {
      res.status = 201;
      res.json(session);
    });
  },

  getSession: function(req, res, next) {
    var id = parseInt(req.params.id);
    Session.findOne({where: {id: id}})
    .then(function(session) {
      res.json(session);
    }, function(err) {
      helpers.errorHandler(err, req, res, next);
    });
  },

  getAllUsers: function(req, res, next) {
    var sessionId = parseInt(req.params.sessionId);
    Session.find({where: {id: sessionId}})
    .then(function(session) {
      // use Sequelize method provided by belongsToMany relationship
      return session.getUsers();
    })
    .then(function(users) {
      res.json(users);
    })
    .catch(function(err) {
      console.error(err);
    });
  },

  addUser: function(req, res, next) {
    var sessionId = parseInt(req.params.sessionId);
    User.find({where: {id: req.user.id}})
    .then(function(user) {
      Session.find({where: {id: sessionId}})
      .then(function(session) {
        return {
          user: user,
          session: session
        };
      })
      .then(function(data) {
        var session = data.session;
        var user = data.user;
        // use Sequelize method provided by belongsToMany relationship
        session.addUser(user);
        res.statusCode = 201;
        res.json(user);
      })
    })
    .catch(function(err) {
      console.error(err);
    })
  }
  
};
