module.exports = (req, res, next) => {
  if (!req.session.isMasuk) {
    return res.redirect('/');
  }
  next();
};
