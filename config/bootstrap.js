/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  //cb();
  console.log("hello")
  User.count().exec(function(err, success){
    if (err){
      cb(err)
    } else if(success > 0){
      cb()
    } else if (success == 0) {
      let users = [
        {email: "chris@lawline.com", password: "password424253"},
        {email: "tee@lawline.com", password: "password424253"},
        {email: "jess@lawline.com", password: "password424253"},
        {email: "oscar@lawline.com", password: "password424253"},
        {email: "test@lawline.com", password: "password424253"}
      ]
      User.create(users).exec((err, success)=>{
        cb()
      })
    }

  })
};
