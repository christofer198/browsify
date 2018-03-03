module.exports = function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization
  } else if (req.param('token')) {
    token = req.param('token');

    delete req.query.token;
  } else {
    return ResponseService.json(401, res, "No authorization header was found");
  }

  JwtService.verify(token, function(err, decoded){
    if (err) return ResponseService.json(401, res, "Invalid Token!", {error: true});
    req.token = token;
    //console.log(decoded)
    User.findOne({id: decoded.id}).then(function(user){
      req.current_user = user;
      req.token = token;
      next();
    })
  });

}
