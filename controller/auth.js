const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator/check');

const User = require('../model/user');

exports.getLogin = (req, res, next) => {
  let pesanErr = req.flash('error');
  if (pesanErr.length > 0) {
    pesanErr = pesanErr[0];
  } else {
    pesanErr = null;
  }
  res.render('auth/login', {
    isMasuk: false,
    errorMsg: pesanErr,
    oldInput: {
      email: '',
      password: ''
    }
  });
};

exports.postLogin = async (req, res, next) => {
  const {email, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      isMasuk: false,
      errorMsg: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      }
    });
  }
  try {
    const user = await User.findOne({email: email});
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
      req.session.isMasuk = true;
      req.session.user = user;
      return req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
