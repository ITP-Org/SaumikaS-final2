import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';
import './Carousel.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Carousel() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
     
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/reviews');
        setReviews(response.data.reverse()); 
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();  
  }, [reviews]);


  /*const addNewReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };*/

  const nextPage = () => {
    if (currentPage < Math.ceil(reviews.length / reviewsPerPage) - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const renderDots = () => {
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const dots = [];

    for (let i = 0; i < totalPages; i++) {
      dots.push(
        <span
          key={i}
          className={`dot ${i === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        ></span>
      );
    }
    return dots;
  };

  const calculateOverallRating = () => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) return 0;

    let sumOfRatings = 0;
    reviews.forEach(review => {
      sumOfRatings += review.rating;
    });

    const averageRating = (sumOfRatings / totalReviews).toFixed(1);
    return averageRating;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 2000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const isLoggedIn = true;
  const message = "You must log in first";

  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/user-reviews');
    } else {
      alert(message);
    }
  };

  return (
    <div className="App">
      <div className="row">
        
        <div className="overall-rating-section">
          <div className="overall-rating">
            
            <div className={`rating-value ${animate ? 'rotate' : ''}`}>{calculateOverallRating()}</div>
            
            <div className="additional-stars">
              <FaStar className="star-header" />
              <FaStar className="star light-purple" />
            </div>
            
          </div>
        </div>

        <h2 className="section-title">
          WHAT <b>STUDENT</b> SAY <b>ABOUT US</b>
        </h2>
      </div>

      <div className="review-carousel">
        
        <button className="carousel-button left" onClick={prevPage} disabled={currentPage === 0}>
          <FaChevronLeft />
        </button>

        <div className="carousel-content">
          {reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage).map((review, index) => (
            <div key={review._id} className={`review-container ${index === 1 ? 'middle-review' : ''}`}>
              
              <div className="review-header">
                
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <FaStar key={i} className={`star ${i < review.rating ? 'filled' : 'unfilled'}`} />
                  ))}
                </div>
                
                <div className="quote">
                  <FaQuoteLeft />
                </div>

              </div>

              <div className="review-text">
                {review.reviewText}
              </div>

              <div className="user-info">
                
                <div className="user-profile">
                  <img src={review.profilePicture} alt="Profile" />
                  <div className="user-name">{review.username}</div>
                </div>

                <div className="review-date">{new Date(review.publishedDate).toLocaleDateString()}</div>

              </div>

            </div>
          ))}
        </div>

        <button className="carousel-button right" onClick={nextPage} disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage) - 1}>
          <FaChevronRight />
        </button>
      
      </div>

      
      <div className="carousel-dots">{renderDots()}</div>

      
      <div className="add-review-btn" onClick={handleButtonClick}>
        Add Review
      </div>
    
    </div>
  );
}

export default Carousel;
