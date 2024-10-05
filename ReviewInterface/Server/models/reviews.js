const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: { type: String, default: null, maxlength: [190, 'Review text cannot exceed 190 characters']},
    rating: { type: Number, required: true, min: [1, 'Rating cannot be less than 1'], max: [5, 'Rating cannot be more than 5']},
    publishedDate: { type: Date, default: Date.now },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true}
});

const Review = mongoose.model('reviews', reviewSchema);

module.exports = Review;
