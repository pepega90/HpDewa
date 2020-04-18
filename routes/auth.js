const express = require('express');
const {body} = require('express-validator/check');

const router = express.Router();

const authController = require('../controller/auth');

// USER MODEL
const User = require('../model/user');

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, {req}) => {
        return User.findOne({email: value}).then(userDoc => {
          if (!userDoc) {
            return Promise.reject('Email is not registered');
          }
        });
      })
      .normalizeEmail(),
    body('password', 'Password has to be valid')
      .isLength({min: 6})
      .trim()
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

module.exports = router;
