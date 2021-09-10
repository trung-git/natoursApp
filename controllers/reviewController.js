const Review = require('../models/reviewModel');
const handleFactory = require('./handleFactory');

// module.exports.getAllReviews = catchAsync(async (req, res, next) => {
//   const filter = {};
//   if (req.params.tourId) filter.tour = req.params.tourId;

//   const review = await Review.find(filter);
//   if (!review) return next(new AppError('Review is not found', 404));
//   res.status(200).json({
//     status: 'success',
//     results: review.length,
//     data: review,
//   });
// });

module.exports.getAllReviews = handleFactory.getAll(Review);
module.exports.getReviewById = handleFactory.getOne(Review);
module.exports.createReview = handleFactory.createOne(Review);
module.exports.deleteReview = handleFactory.deleteOne(Review);
module.exports.updateReview = handleFactory.updateOne(Review);

module.exports.setTourAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};
