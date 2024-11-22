import React, { useEffect, useState, useContext } from 'react';
import { FlaskApiContext } from '../App';

import './ImageDisplay.css';

const ImageDisplay = ({ refreshImages, optionsSelected = { showOriginal: true, showTranslated: true, showColorized: true }, onProcessingComplete }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorizedImages, setColorizedImages] = useState([]);
  const [isHealthOk, setIsHealthOk] = useState(false);

  // Get the Flask API URL from environment variables
  const flaskApiUrl = useContext(FlaskApiContext);

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Function to fetch original uploaded images
  const fetchImages = async () => {
    const sessionId = sessionStorage.getItem('sessionKey');
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }
  
    try {
      const response = await fetch(`${flaskApiUrl}/get-images/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Skip the ngrok warning
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Uploaded images:', data);
  
      // Modify the URLs for direct image rendering
      const updatedImages = data.images.map(imageUrl =>
        imageUrl.replace('?dl=0', '?raw=1') // Replace ?dl=0 with ?raw=1
      );
  
      setUploadedImages(updatedImages);
    } catch (error) {
      setUploadedImages([]); // Handle error by clearing the image state
      console.error(error.message);
    }
  };
  

  // Function to fetch colorized images by polling for status
  const fetchColorizedImages = async () => {
    const sessionId = sessionStorage.getItem('sessionKey');
    if (!sessionId) {
      console.error('Session ID is undefined');
      return;
    }

    try {
      const statusCheckInterval = setInterval(async () => {
        const statusResponse = await fetch(`${flaskApiUrl}/colorization-status/${sessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', // Skip the ngrok warning page
          },
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('Error fetching colorization status:', errorData.error);
          clearInterval(statusCheckInterval); // Stop polling on error
          return; // Exit if error occurs
        }

        const statusData = await statusResponse.json();
        console.log('Status data received:', statusData);

        if (statusData.status === 'completed') {
          clearInterval(statusCheckInterval); // Stop polling on completion

          const response = await fetch(`${flaskApiUrl}/get-colorized-images/${sessionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true', // Skip the ngrok warning page
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch colorized images: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Colorized images:', data);
          setColorizedImages(data.colorized_images);

          onProcessingComplete(); // Notify parent component
        } else if (statusData.status === 'failed') {
          clearInterval(statusCheckInterval); // Stop polling on failure
          console.error('Failed to colorize images.');
        } else {
          console.log('Colorization is still in progress.');
        }
      }, 2000); // Poll every 2 seconds
    } catch (error) {
      setColorizedImages([]); // Handle error by clearing the image state
      console.error(error.message);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (!flaskApiUrl) {
        setError('Flask API URL is not set.');
        return;
      }

      try {
        // Health check
        const healthResponse = await fetch(`${flaskApiUrl}/api/health`, { method: 'GET' });
        if (!healthResponse.ok) {
          throw new Error('Flask API health check failed');
        }

        setIsHealthOk(true); // Mark health check as successful
        setError(''); // Clear any previous error

        // Fetch images
        await fetchImages();

        // Fetch colorized images if the option is selected
        if (optionsSelected.showColorized) {
          await fetchColorizedImages();
        }
      } catch (error) {
        setError('Flask API server is not running. Please start the server.');
        setIsHealthOk(false);
      }
    };

    initialize();
  }, [refreshImages, optionsSelected.showColorized, flaskApiUrl]);

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

      {error && <div className="error-message">{error}</div>}

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
