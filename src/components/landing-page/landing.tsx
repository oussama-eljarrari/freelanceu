import React from 'react';

export const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to FreelanceU</h1>
        <p>Your platform for freelance excellence</p>
      </header>
      
      <main className="landing-content">
        <section className="hero">
          <h2>Get Started Today</h2>
          <button className="cta-button">Join Now</button>
        </section>
      </main>
      
      <footer className="landing-footer">
        <p>&copy; 2024 FreelanceU. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
