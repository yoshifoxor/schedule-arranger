'use strict';

function ensurer(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`/login?from=${req.originalUrl}`);
}

module.exports = ensurer;
