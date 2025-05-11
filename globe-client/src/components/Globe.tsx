
import React from 'react';

const Globe: React.FC = () => {
  return (
    <div className="globe-container">
      <div className="globe-outer"></div>
      <div className="globe-inner"></div>
      <div className="globe-core"></div>
      
      {/* Location dots */}
      <div className="location-dot" style={{ top: '30%', left: '25%' }}></div>
      <div className="location-dot" style={{ top: '40%', left: '75%' }}></div>
      <div className="location-dot" style={{ top: '60%', left: '40%' }}></div>
      <div className="location-dot" style={{ top: '25%', left: '60%' }}></div>
      <div className="location-dot" style={{ top: '70%', left: '55%' }}></div>
    </div>
  );
};

export default Globe;
