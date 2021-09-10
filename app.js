const express = require('express');
const expressLayout = require('express-ejs-layouts');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

//Router
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRoter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// 1)GLOBAL MIDDLEWARES
if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 5 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour !',
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, './views/layouts/index'));
app.use(expressLayout);

//Set up
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

//set securerity HTTP header
app.use(helmet());
app.use(limiter);
//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data Sanitization against XSS
app.use(xss());
//Prevent HTTP params polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'name',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'priceDiscount',
    ],
  })
);

//App route
// app.use('*', (req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
app.use(function (req, res, next) {
  res.set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com ws://localhost:59948/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests; frame-src  https://js.stripe.com/v3/ 'self' "
  );
  next();
});
app.use('/', viewRouter);
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/booking', bookingRoter);
app.all('*', (req, res, next) => {
  next(new AppError(`Not found ${req.originalUrl}`, 404));
});
//Error handling
app.use(globalErrorHandler);

module.exports = app;
