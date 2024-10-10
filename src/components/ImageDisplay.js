import React, { useEffect, useState } from 'react';
import './ImageDisplay.css'; 

const ImageDisplay = ({ refreshImages, optionsSelected = { showOriginal: true, showTranslated: true, showColorized: true } }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorizedImages, setColorizedImages] = useState([]);  // New state for colorized images

  const flaskApiUrl = process.env.REACT_APP_FLASK_API_URL;

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    fetchImages();
    if (optionsSelected.showColorized) {
      fetchColorizedImages();  // Fetch colorized images if enabled
    }
  }, [refreshImages]);

  const fetchImages = async () => {
    const sessionId = sessionStorage.getItem('sessionKey');
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }

    try {
      const response = await fetch(`${flaskApiUrl}/get-images/${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadedImages(data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
      setUploadedImages([]);
    }
  };

  const fetchColorizedImages = async () => {
    const sessionId = sessionStorage.getItem('sessionKey');
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }

    try {
      const response = await fetch(`${flaskApiUrl}/get-colorized-images/${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch colorized images: ${response.statusText}`);
      }

      const data = await response.json();
      setColorizedImages(data.colorized_images);
    } catch (error) {
      console.error("Error fetching colorized images:", error);
      setColorizedImages([]);
    }
  };

  return (
    <div className="image-display">
      <div className="view-bar">
        <button className={`view-button ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => handleViewChange('grid')}>
          Grid View
        </button>
        <button className={`view-button ${viewMode === 'stacked' ? 'active' : ''}`} onClick={() => handleViewChange('stacked')}>
          Stacked View
        </button>
      </div>

      <div className="cards-container">
        {optionsSelected.showOriginal && (
          <div className="image-card">
            <h3 className="card-heading">Original Images</h3>
            <div className={`image-row ${viewMode}`}>
              {uploadedImages.length > 0 ? (
                uploadedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Manga page ${index + 1}`} />
                  </div>
                ))
              ) : (
                <p>No images available.</p>
              )}
            </div>
          </div>
        )}

        {optionsSelected.showTranslated && (
          <div className="image-card">
            <h3 className="card-heading">Translated Images</h3>
            <div className={`image-row ${viewMode}`}>
              <p>No translated images available.</p>
            </div>
          </div>
        )}

        {optionsSelected.showColorized && (
          <div className="image-card">
            <h3 className="card-heading">Colorized Images</h3>
            <div className={`image-row ${viewMode}`}>
              {colorizedImages.length > 0 ? (
                colorizedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Colorized Manga page ${index + 1}`} />
                  </div>
                ))
              ) : (
                <p>No colorized images available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
