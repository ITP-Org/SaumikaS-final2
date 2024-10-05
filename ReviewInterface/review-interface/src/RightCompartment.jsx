import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; 
import './RightCompartment.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RightCompartment = () => {
  const [rating, setRating] = useState(0); 
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(null); 
  const { id } = useParams();
  const [fullName, setFullName] = useState(''); 
  const [profilePicture, setProfilePicture] = useState(''); 

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${id}`)
      .then(response => {
        const user = response.data;
        const fullName = `${user.firstname} ${user.lastname}`;
        setFullName(fullName); 
        setProfilePicture(user.profilePicture);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [id]);

  const handleRatingClick = (stars) => {
    setRating(stars); 
  };

  const handlePostReview = () => {

    if (reviewText.length > 190) {
      alert('Review text cannot exceed 190 characters.');
      return;
    }

    if (rating <= 0) {
      alert('Enter star rating value');
      return;
    }
    
    const reviewData = {
      reviewText: reviewText,
      rating: rating, 
      userId: id
    };

    axios.post('http://localhost:3001/reviews', reviewData)
      .then(response => {
        alert('Review posted successfully!');
        setRating(0); 
        setReviewText(''); 
      })
      .catch(error => console.error('Error posting review:', error));
  };

  const handleRatingHover = (index) => {
    setHoveredStar(index); 
  };

  const handleRatingLeave = () => {
    setHoveredStar(null); 
  };

  return (
    <>
      <h2>Rate and Review Us</h2>
      
      <div className="right-compartment">
        <div className="inner-compartment">
          
          <div className="profile-section">
            
            <div className="profile-picture" style={{ backgroundImage: `url(${profilePicture})` }}></div>
            
            <div className="user-info">
              <h4>{fullName}</h4> 
              
              <div className="rating-text">Rating ({rating}/5)</div>
              <div className="rating-stars">
                {[...Array(5)].map((star, index) => (
                  <span
                    key={index}
                    className={`star ${index < rating ? 'active' : ''} ${index === hoveredStar ? 'hover' : ''}`}
                    onClick={() => handleRatingClick(index + 1)} 
                    onMouseEnter={() => handleRatingHover(index)} 
                    onMouseLeave={handleRatingLeave} 
                  >
                    {index < rating || index === hoveredStar ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

            </div>
          </div>

          <div className="review-section">
            <h3>Write a Review</h3>

            <textarea
              placeholder="Write something about us..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <button className="post-button" onClick={handlePostReview}>
              Post
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default RightCompartment;
