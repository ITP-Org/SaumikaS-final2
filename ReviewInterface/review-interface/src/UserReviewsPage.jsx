import React from 'react';
import { useParams } from 'react-router-dom';
import LeftCompartment from './LeftCompartment.jsx';
import RightCompartment from './RightCompartment.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './UserReviewsPage.css';


function UserReviewsPage() {

  //retreiving user ID from URL parameters
  const { id } = useParams();

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <div className="left-compartment-container">
          <LeftCompartment id={id} />
        </div>
        <div className="right-compartment-container">
          <RightCompartment id={id} />
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default UserReviewsPage;
