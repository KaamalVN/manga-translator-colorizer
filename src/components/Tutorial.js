// components/Tutorial.js
import React from 'react';
import './Tutorial.css';  // Import CSS for styling

const Tutorial = ({ step, onNext, onSkip, onClose }) => {
  const instructions = [
    {
      text: "This is a tutorial.",
      target: null,
    },
    {
      text: "This part is for image upload.",
      target: '.image-uploader',
    },
    {
      text: "Now you can choose options to process your images.",
      target: '.options-panel',
    },
    {
      text: "Finally, view your processed images here.",
      target: '.image-display',
    },
  ];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <p>{instructions[step].text}</p>
        <div className="tutorial-buttons">
          <button onClick={onNext} disabled={step >= instructions.length - 1}>Next</button>
          <button onClick={onSkip}>Skip</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      {instructions[step].target && (
        <div className={`tutorial-arrow ${instructions[step].target}`} />
      )}
    </div>
  );
};

export default Tutorial;
