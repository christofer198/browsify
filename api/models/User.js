/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require("bcrypt")
var bluebird = require("bluebird")

module.exports = {

  attributes: {
    email: {
      type: "email",
      required: true,
      unique: true
    },

    password: {
      minLength: 6,
      protected: true,
      required: true,
      columnName: 'encryptedPassword'
    },

    campaigns: {
      collection: 'campaign',
      via: 'owner'
    },

    toJSON: function(){
      var obj = this.toObject()
      delete obj.password
      return obj
    },
  },

  beforeCreate: function(values, cb){
    bcrypt.hash(values.password, 10, function(err,hash){
      if(err) return cb(err)

      values.password = hash

      cb()
    })
  },

  comparePassword: function(password, user){
    return new Promise(function(resolve, reject){
      bcrypt.compare(password, user.password, function(err, match){
        if (err) console.log(err)

        if(match){
          resolve(true)
        } else {
          resolve(err)
        }
      })
    })
  },
connection: "someMongodbServer"
};
