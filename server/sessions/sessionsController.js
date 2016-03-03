var helpers = require('../config/helpers');
var Session = require('./sessions');
var User = require('../users/users');

module.exports = {

  getAllSessions: function(req, res, next) {
    Session.findAll()
    .then(function(sessions) {
      res.send(sessions);
    })
  },

  addSession: function(req, res, next) {
    var sessionName = req.body.sessionName;

    Session.create({
      sessionName: sessionName
    }).then(function(session) {
      res.status = 201;
      res.json(session);
    });
  },

  getSession: function(req, res, next) {
    var id = parseInt(req.params.id);
    Session.findOne({where: {ide: id}})
    .then(function(session) {
      res.json(session);
    }, function(err) {
      helpers.errorHandler(err, req, res, next);
    });
  },

  getAllUsers: function(req, res, next) {
    var sessionId = req.params.sessionId;
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

  // getOneUser: function(req, res, next) {
  //   console.log('query', req.query);
  // },

  addUser: function(req, res, next) {
    User.find({where: {id: req.body.userId}})
    .then(function(user) {
      Session.find({where: {id: req.body.sessionId}})
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
        res.json(user);
      })
    })
    .catch(function(err) {
      console.error(err);
    })
  }
  
};
