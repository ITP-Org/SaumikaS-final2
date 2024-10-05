const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Review = require('./models/reviews');
const User = require('./models/users');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/LMS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Fetch user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Add a new review
app.post('/reviews', async (req, res) => {
    try {
        const { reviewText, rating, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const newReview = new Review({
            reviewText,
            rating,
            userId
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Error saving the review' });
    }
});

//fetch reviews by userId
app.get('/LMS/reviews/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        const reviews = await Review.find({ userId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

//update reviews
app.put('/reviews/:id', async (req, res) => {
    try {
        const { reviewText, rating} = req.body;
        const review = await Review.findById(req.params.id); 
        if (!review) return res.status(404).json({ error: 'Review not found' });

        review.reviewText = reviewText;
        review.rating = rating;
        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Error updating the review' });
    }
});

//delete reviews
app.delete('/reviews/:id', async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });
  
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting the review' });
    }
  });

 //fetch all reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'firstname lastname profilePicture') 
            .exec();

        const reviewsWithUserInfo = reviews.map(review => ({
            reviewText: review.reviewText,
            rating: review.rating,
            publishedDate: review.publishedDate,
            username: `${review.userId.firstname} ${review.userId.lastname}`, 
            profilePicture: review.userId.profilePicture
        }));

        res.json(reviewsWithUserInfo);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
