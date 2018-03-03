/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

   login: function (req, res) {
     var email = req.param('email');
     var password = req.param('password');

     verifyParams(res, email, password)

     User.findOne({email: email}).then(function (user) {
       if (!user) {
         return invalidEmailOrPassword(res);
       }
       signInUser(req, res, password, user)
     }).catch(function (err) {
       return invalidEmailOrPassword(res);
     })
   },

   authenticate: function(req,res){
     var responseData = {
       user: req.current_user,
       token: req.token
     }

     return ResponseService.json(200, res, "Token Match!", responseData)
   }
 };


 function signInUser(req, res, password, user) {
   User.comparePassword(password, user).then(
     function (valid) {
       if (!valid) {
         return this.invalidEmailOrPassword();
       } else {
         var responseData = {
           user: user,
           token: generateToken(user.id)
         }
         return ResponseService.json(200, res, "Successfully signed in", responseData)
       }
     }
   ).catch(function (err) {
     let error = true
     return ResponseService.json(401, res, "Forbidden", error)
   })
 };


 function invalidEmailOrPassword(res){
   let error = {error: true}
   return ResponseService.json(401, res, "Invalid email or password", error)
 };

 function verifyParams(res, email, password){
   if (!email || !password) {
     return ResponseService.json(401, res, "Email and password required")
   }
 };


 function generateToken(user_id) {
   return JwtService.issue({id: user_id})
 };
