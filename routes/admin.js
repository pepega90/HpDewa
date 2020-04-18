const express = require('express');

const router = express.Router();

const adminController = require('../controller/admin');

const isAuth = require('../middleware/is-auth');
const {body} = require('express-validator/check');

const Case = require('../model/case-product');
const upload = require('../middleware/multer');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.get('/product', isAuth, adminController.getAdminProduct);

router.post(
  '/add-product',
  [
    body('nama')
      .notEmpty()
      .withMessage('Nama Product tidak boleh kosong')
      .custom((value, {req}) => {
        return Case.findOne({product: value}).then(nameProduct => {
          if (nameProduct) {
            return Promise.reject('Product dengan nama ini sudah ada!');
          }
        });
      }),
    body('harga')
      .notEmpty()
      .withMessage('Harga tidak boleh kosong')
  ],
  isAuth,
  adminController.postAddProduct
);

router.post(
  '/edit-product',
  [
    body('nama')
      .notEmpty()
      .withMessage('Nama Product tidak boleh kosong')
      .custom((value, {req}) => {
        return Case.findOne({product: value}).then(nameProduct => {
          if (nameProduct) {
            return Promise.reject('Product dengan nama ini sudah ada!');
          }
        });
      }),
    body('harga')
      .notEmpty()
      .withMessage('Harga tidak boleh kosong')
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product/:prodId', isAuth, adminController.postDelete);

module.exports = router;
