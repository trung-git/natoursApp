const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  if (!tours) return next(new AppError('Tour is empty', 404));
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  if (!req.params.slug) return next(new AppError('Please provide the slug'));
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  res.locals.mapbox = true;
  // console.log({ tour, review: tour.reviews });
  if (!tour) return next(new AppError('Tour is not found', 404));
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests; frame-src  https://js.stripe.com/v3/ 'self' "
    // )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account',
  });
};
exports.getMyTours = async (req, res, next) => {
  const Bookings = await Booking.find({ user: req.user.id });

  const tourIds = Bookings.map((el) => {
    return el.tour.id;
  });

  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'Your tours',
    tours,
  });
};
