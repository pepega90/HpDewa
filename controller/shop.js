const Case = require('../model/case-product');

exports.getShop = (req, res, next) => {
  Case.find()
    .then(product => {
      res.render('home/index', {
        casing: product,
        isMasuk: req.session.isMasuk
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};
