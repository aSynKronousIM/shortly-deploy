var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  username: {type: STRING, required: true, index: {unique: true}},
  password: {type: STRING, required: true}
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(enteredPassword, savedPassword, cb) {
  bcrypt.compare(enteredPassword, savedPassword, function(err, matched) {
    if (err) {
      return cb(err);
    } else {
      cb(null, matched);
    }
  });
};

userSchema.pre('save', function(next) {
  var cipher = bluebird.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next():
    });
});

//// sqlite3
//var User = db.Model.extend({
//  tableName: 'users',
//  hasTimestamps: true,
//  initialize: function(){
//    this.on('creating', this.hashPassword);
//  },
//  comparePassword: function(attemptedPassword, callback) {
//    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//      callback(isMatch);
//    });
//  },
//  hashPassword: function(){
//    var cipher = Promise.promisify(bcrypt.hash);
//    return cipher(this.get('password'), null, null).bind(this)
//      .then(function(hash) {
//        this.set('password', hash);
//      });
//  }
//});

module.exports = User;
