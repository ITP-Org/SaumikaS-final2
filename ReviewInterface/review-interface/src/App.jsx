import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllReviewsPage from './AllReviewsPage'
import UserReviewsPage from './UserReviewsPage'

function App (){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<AllReviewsPage />} />
        <Route path="/user-reviews/:id" element={<UserReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App