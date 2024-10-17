import React, { useEffect, useState, useCallback } from 'react';
import './ImageDisplay.css'; 

const ImageDisplay = ({ refreshImages, optionsSelected = { showOriginal: true, showTranslated: true, showColorized: true }, onProcessingComplete }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorizedImages, setColorizedImages] = useState([]);

  // Get the Flask API URL from environment variables
  const flaskApiUrl = process.env.REACT_APP_FLASK_API_URL;

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Function to fetch original uploaded images
  const fetchImages = useCallback(async () => {
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
      console.log('Uploaded images:', data);
      setUploadedImages(data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
      setUploadedImages([]); // Handle error by clearing the image state
    }
  }, [flaskApiUrl]);

  // Function to fetch colorized images by polling for status
  const fetchColorizedImages = useCallback(async () => {
    const sessionId = sessionStorage.getItem('sessionKey');
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }

    try {
      const statusCheckInterval = setInterval(async () => {
        const statusResponse = await fetch(`${flaskApiUrl}/colorization-status/${sessionId}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          clearInterval(statusCheckInterval);  // Stop polling on completion
          
          const response = await fetch(`${flaskApiUrl}/get-colorized-images/${sessionId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch colorized images: ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Colorized images:', data);
          setColorizedImages(data.colorized_images);
          
          onProcessingComplete();  // Notify parent component
        } else if (statusData.status === 'failed') {
          clearInterval(statusCheckInterval);  // Stop polling on failure
          console.error('Failed to colorize images.');
        }
      }, 2000);  // Poll every 2 seconds

    } catch (error) {
      console.error("Error fetching colorized images:", error);
      setColorizedImages([]); // Handle error by clearing the image state
    }
  }, [flaskApiUrl, onProcessingComplete]);

  useEffect(() => {
    fetchImages();
    if (optionsSelected.showColorized) {
      fetchColorizedImages();  // Fetch colorized images if option is selected
    }
  }, [refreshImages, optionsSelected.showColorized, fetchImages, fetchColorizedImages]);

  return (
    <div className="image-display">
      {/* View Mode Toggle Buttons */}
      <div className="view-bar">
        <button className={`view-button ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => handleViewChange('grid')}>
          Grid View
        </button>
        <button className={`view-button ${viewMode === 'stacked' ? 'active' : ''}`} onClick={() => handleViewChange('stacked')}>
          Stacked View
        </button>
      </div>

      <div className="cards-container">
        {/* Original Images Section */}
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

        {/* Translated Images Section */}
        {optionsSelected.showTranslated && (
          <div className="image-card">
            <h3 className="card-heading">Translated Images</h3>
            <div className={`image-row ${viewMode}`}>
              <p>No translated images available.</p>  {/* Placeholder for future translated images */}
            </div>
          </div>
        )}

        {/* Colorized Images Section */}
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
