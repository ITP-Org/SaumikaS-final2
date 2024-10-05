import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaChevronDown, FaPencilAlt, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import './LeftCompartment.css';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const LeftCompartment = () => {
  const { id } = useParams(); 
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewContent, setEditedReviewContent] = useState('');
  const [editedReviewRating, setEditedReviewRating] = useState(0);
  const contentRef = useRef(null);
  const formatDate = (date) => moment(date).format('YYYY-MM-DD');

  useEffect(() => {
  if (id) {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/LMS/reviews/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    const intervalId = setInterval(fetchReviews, 5000);

    return () => clearInterval(intervalId);
  }
}, [id]);
  

  const handleToggleExpand = (id) => {
    if (expandedReviewId === id) {
      setExpandedReviewId(null); 
    } else {
      setExpandedReviewId(id);
    }
  };

  const handleEdit = (id, content, rating) => {
    setEditingReviewId(id);
    setEditedReviewContent(content);
    setEditedReviewRating(rating);
    setTimeout(() => {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(0, content.length);
    }, 300);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditedReviewContent('');
    setEditedReviewRating(0);
  };

  const handleDoneEdit = (id) => {
    if (editedReviewContent.length > 190) {
      alert('Review text cannot exceed 190 characters.');
      return;
    }

    const updatedReviews = reviews.map((review) =>
      review._id === id ? { ...review, reviewText: editedReviewContent, rating: editedReviewRating } : review
    );

    setReviews(updatedReviews);
    setEditingReviewId(null);
    setEditedReviewContent('');
    setEditedReviewRating(0);

    axios
      .put(`http://localhost:3001/reviews/${id}`, {
        reviewText: editedReviewContent,
        rating: editedReviewRating,
      })
      .then(() => {
        window.alert('Review updated successfully');
      })
      .catch((error) => console.error('Error updating review:', error));
  };
  
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    
    if (confirmDelete) {
      const updatedReviews = reviews.filter((review) => review._id !== id);
      setReviews(updatedReviews);
  
      axios.delete(`http://localhost:3001/reviews/${id}`)
        .then(() => {
          window.alert('Review deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting review:', error);
          setReviews(reviews);
        });
    }
  };

  const handleRatingChange = (newRating) => {
    if (newRating === editedReviewRating) {
      setEditedReviewRating(0);
    } else {
      setEditedReviewRating(newRating);
    }
  };

  return (
    <>
      <h2>My Reviews</h2>
      <div className="left-compartment">
        <div className="reviews-container">
          {reviews.slice().reverse().map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <span className="review-date">{formatDate(review.publishedDate)}</span>
                {editingReviewId !== review._id && (
                  <button
                    className={`dropdown-button ${expandedReviewId === review._id ? 'rotate' : ''}`}
                    onClick={() => handleToggleExpand(review._id)}
                  >
                    <FaChevronDown />
                  </button>
                )}
              </div>

              <div className={`review-content ${expandedReviewId === review._id ? 'expanded' : ''}`}>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      onClick={() => handleRatingChange(index + 1)}
                      className={index < (editingReviewId === review._id ? editedReviewRating : review.rating) ? 'clicked' : ''}
                    >
                      {index < (editingReviewId === review._id ? editedReviewRating : review.rating) ? (
                        <FaStar color="#744ECD" />
                      ) : (
                        <FaRegStar color="#744ECD" />
                      )}
                    </span>
                  ))}
                </div>

                {editingReviewId === review._id ? (
                  <textarea
                    ref={contentRef}
                    className="edit-textarea"
                    value={editedReviewContent}
                    onChange={(e) => setEditedReviewContent(e.target.value)}
                  />
                ) : (
                  <div className="review-text">{review.reviewText}</div> 
                )}
              </div>

              {expandedReviewId === review._id && !editingReviewId && (
                <div className="actions">
                  <button className="edit-button" onClick={() => handleEdit(review._id, review.reviewText, review.rating)}> 
                    <FaPencilAlt />
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(review._id)}>
                    <FaTrash />
                  </button>
                </div>
              )}

              {editingReviewId === review._id && (
                <div className="edit-actions">
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="done-button" onClick={() => handleDoneEdit(review._id)}>
                    Done
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LeftCompartment;
