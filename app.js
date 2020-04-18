const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const multer = require('multer');
require('dotenv').config();
require('./middleware/cloudinaryConfig');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-7im4l.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: 'sessionHpDewa'
});

// MULTER CONFIG
const fileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// CONTROLLER
const errorController = require('./controller/error');

// MODEL
const User = require('./model/user');

// ROUTES
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');

// MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false})).use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
app.use(csrf());
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isMasuk = req.session.isMasuk;
  next();
});

// REGISTER ROUTE
app.use('/admin', adminRoute);
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);
// ERROR HANDLER
app.use((error, req, res, next) => {
  res.status(500).render('error/500');
});

// CONNECT TO DATABASE
mongoose.connect(MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log('Connected to mongodb');
  });
});
