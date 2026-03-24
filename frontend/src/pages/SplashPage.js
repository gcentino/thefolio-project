import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState('...');

  // Dots animation logic (...)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    
    // Redirect sa home after 3 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    /* Siguraduhin na 'loader-container' ang class para gumana ang CSS centering */
    <div className="loader-container">
      <div className="splash-content"> {/* Dinagdagan ko ng wrapper para mas madali i-center */}
        <div className="logo-wrapper">
          {/* Nilagyan ko ng '/' sa unahan ng src para sigurado sa public folder path */}
          <img src="/picture/badmintonLogo.jpg" alt="Badminton Logo" className="logo-img" />
        </div>
        
        <h1 className="splash-title">Badminton</h1>
        
        <div className="spinner"></div>
        
        <div className="loading-text">
          Preparing the court<span>{dots}</span>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;