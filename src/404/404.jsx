import React from 'react';
// import { useNavigate } from 'react-router-dom';
import './NotFoundPage.scss'; // Global SCSS import
import { NETWORKED_FRONTEND_URL } from '../helper/constants';

const NotFoundPage = () => {
  // const navigate = useNavigate();

  const handleGoHome = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses`; // Redirect to the homepage
  };

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <button type="button" className="notfound-home-button" onClick={handleGoHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
