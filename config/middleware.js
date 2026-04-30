function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.error = "Please login to continue.";
  return res.redirect("/login");
}

function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/movie");
}

module.exports = {
  ensureAuthenticated,
  ensureGuest
};
