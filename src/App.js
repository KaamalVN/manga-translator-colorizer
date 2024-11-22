import React, { useState, useEffect, createContext } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';
import Joyride from 'react-joyride';  // Import Joyride
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export const FlaskApiContext = createContext();

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);
  const [mobileView, setMobileView] = useState('upload');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [processingStatus, setProcessingStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);  // State for running tutorial
  const [flaskApiUrl, setFlaskApiUrl] = useState(() => {
    // Retrieve the Flask API URL from localStorage on initial load
    return localStorage.getItem('flaskApiUrl') || process.env.REACT_APP_FLASK_API_URL || '';
  });
  const [isInputVisible, setInputVisible] = useState(false); // To track visibility of the input box
  const [newUrl, setNewUrl] = useState(''); // To store the new URL input by the user

  useEffect(() => {
    // Function to send flaskApiUrl to backend automatically
    console.log("flaskApiUrl in App: ",flaskApiUrl);
    // Call the function when the component mounts or flaskApiUrl changes
    if (flaskApiUrl) {
      sendFlaskApiUrl(flaskApiUrl);
    }
  }, [flaskApiUrl]); // Dependency array ensures it runs when flaskApiUrl changes

  const sendFlaskApiUrl = (flaskApiUrl) => {
    console.log("sendFlaskApiUrl called");
    if (!flaskApiUrl) {
      console.error("Flask API URL is undefined.");
      return;
    }
  
    setLoading(true); // Set loading state
  
    // Directly update the Flask API URL
    fetch(`${flaskApiUrl}/api/update-flask-url`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: flaskApiUrl }),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to update Flask API URL');
        }
        return response.json(); // Parse JSON response
      })
      .then((data) => {
        console.log('Flask API URL updated:', data);
        setLoading(false);  // Stop loading when done
      })
      .catch((error) => {
        console.error('Error updating Flask API URL:', error);
  
        // Handle specific error scenarios
        if (error.message.includes('Failed to fetch')) {
          alert('Flask API server is not reachable. Please check the URL or start the server.');
        }
  
        setLoading(false);  // Stop loading on error
      });
  };
  

  const handleApiUrlChange = (e) => {
    setFlaskApiUrl(e.target.value);
  };

  // Handle files being added
  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };

  // Handle when processing starts
  const handleProcessingStarted = () => {
    console.log('Processing started...');
    setProcessingStatus('Processing started...');
    setLoading(true);
  };

  // Handle when the model is running
  const handleModelRunning = () => {
    setProcessingStatus('Model running...');
    setRefreshImages((prev) => !prev);
  };

  // Handle when processing is complete
  const handleProcessingComplete = () => {
    console.log('Processing completed with images:');
    setProcessingStatus('');
    setLoading(false);
  };

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleButtonClick = () => {
    setInputVisible(!isInputVisible);
  };

  // Update Flask URL from the input box when the user submits
  const handleSubmit = () => {
    setFlaskApiUrl(newUrl); // Update the global Flask URL
    localStorage.setItem('flaskApiUrl', newUrl);
    sendFlaskApiUrl(newUrl); // Send it to the backend
    setInputVisible(false); // Hide the input after submitting
  };

  const steps = [
    {
      target: 'body', // Display the card in the center of the page
      content: 'This tutorial will show you how to use the website for uploading, translating, and colorizing manga.',
      placement: 'center',
      disableBeacon: true, // Show card directly, no beacon
    },
    {
      target: '.drop-area', // Class name for ImageUploader
      content: 'Drag and drop your manga images here, or click to upload from your gallery.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.link-input', // Class name for OptionsPanel
      content: 'You can also enter a link to a manga page or chapter here.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.submit-link', // Class name for ImageDisplay
      content: 'Click this button if you are uploading images via a link.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.option-container', // Class name for OptionsPanel
      content: 'If you want to use the translator, enable it and choose your desired model from this section.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.option-container2', // Class name for OptionsPanel
      content: 'If you want to use the colorizer, enable it here.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.start-processing', // Class name for OptionsPanel
      content: 'This button will be enabled if you choose at least one option above. Click this to start processing.',
      disableBeacon: true, // Disable beacon
    },
  ];
  
  const mobileSteps = [
    {
      target: 'body', // Display the card in the center of the page
      content: 'This tutorial will show you how to use the website for uploading, translating, and colorizing manga.',
      placement: 'center',
      disableBeacon: true, // Show card directly, no beacon
    },
    {
      target: '.drop-area', // Class name for ImageUploader
      content: 'Click here to upload from your gallery.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.link-input', // Class name for OptionsPanel
      content: 'You can also enter a link to a manga page or chapter here.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.submit-link', // Class name for ImageDisplay
      content: 'Click this button if you are uploading images via a link.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.mobile-toggle-container', // Class name for ImageDisplay
      content: 'Here, you can toggle between the upload part and the settings.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.option-container', // Class name for OptionsPanel
      content: 'If you want to use the translator, enable it and choose your desired model from this section.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.option-container2', // Class name for OptionsPanel
      content: 'If you want to use the colorizer, enable it here.',
      disableBeacon: true, // Disable beacon
    },
    {
      target: '.start-processing', // Class name for OptionsPanel
      content: 'This button will be enabled if you choose at least one option above. Click this to start processing.',
      disableBeacon: true, // Disable beacon
    },
  ];
  
   // Handle URL input submission
  

  return (
    <FlaskApiContext.Provider value={flaskApiUrl}>
    <div className="app">
      <header className="logo-header">
        <div className="logo">Manga Translator & Colorizer</div>
        <div className="button-header">
        <button
          className="api-url-button"
          onClick={handleButtonClick}
        >
          <FontAwesomeIcon icon={faLink} size="lg" />
        </button>
        <button 
          className="tutorial-button" 
          onClick={() => setRunTutorial(true)}  // Start the tutorial
        >
          <FontAwesomeIcon icon={faQuestionCircle} size="2x" />
        </button>
        </div>

        {isInputVisible && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Enter Flask API URL</h3>
              <input 
                type="text" 
                value={newUrl} 
                onChange={(e) => setNewUrl(e.target.value)} 
                placeholder="Enter Flask API URL"
              />
              <div className="url-button-header">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={handleButtonClick}>Close</button>
              </div>
            </div>
          </div>
        )}

      </header>


      <Joyride 
        steps={isMobile ? mobileSteps : steps}
        run={runTutorial}  // Control Joyride visibility
        continuous
        showSkipButton={true}  // Show the skip button
        showProgress
        scrollToFirstStep
        styles={{
          options: {
            zIndex: 10000,  // Ensure Joyride overlay is above other components
          },
          tooltip: {
            backgroundColor: '#161623',  // Change tooltip background color
            borderRadius: '8px',         // Make the corners rounded
            color: '#fff',               // Text color
            fontSize: '16px',            // Adjust font size
          },
          buttonNext: {
            backgroundColor: '#007bff',  // Change next button color
            borderRadius: '4px',
            fontSize: '14px',
          },
          buttonSkip: {
            backgroundColor: 'transparent', // Skip button background
            color: '#555',                  // Text color of skip button
          },
          buttonBack: {
            color: '#fff',
            fontSize: '14px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',  // Customize the overlay behind the tooltip
          },
        }}
        callback={(data) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setMobileView('upload')
            setRunTutorial(false);  // Stop the tutorial on finish or skip
          }
          // Check if the step index is the one that requires changing the mobile view
          if (data.action === 'next' && data.index === 4) {
            setMobileView('settings'); // Change to settings view
          }
        }}
      />

      {isMobile ? (
        <>
          {/* Mobile-specific components */}
          <div className="mobile-toggle-container">
            <div className="mobile-toggle">
              <button 
                className={`toggle-button ${mobileView === 'upload' ? 'active' : ''}`} 
                onClick={() => setMobileView('upload')}
              >
                Upload
              </button>
              <button 
                className={`toggle-button ${mobileView === 'settings' ? 'active' : ''}`} 
                onClick={() => setMobileView('settings')}
              >
                Settings
              </button>
            </div>
          </div>
          <div className="content mobile-content">
            <div className={`mobile-box ${mobileView === 'upload' ? 'show' : 'hide'} image-uploader`}>
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>
            <div className={`mobile-box ${mobileView === 'settings' ? 'show' : 'hide'} options-panel`}>
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted}
                processingStatus={processingStatus}
                loading={loading}
                onModelRunning={handleModelRunning} 
              />
            </div>
          </div>
          <div className="image-display-container image-display">
            <ImageDisplay refreshImages={refreshImages} onProcessingComplete={handleProcessingComplete} />
          </div>
        </>
      ) : (
        <>
          {/* Desktop-specific components */}
          <div className="content desktop-content">
            <div className="column left image-uploader">
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>
            <div className="column middle image-display">
              <ImageDisplay refreshImages={refreshImages} onProcessingComplete={handleProcessingComplete} />
            </div>
            <div className="column right options-panel">
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted}
                processingStatus={processingStatus}
                loading={loading}
                onModelRunning={handleModelRunning} 
              />
            </div>
          </div>
        </>
      )}
    </div>
    </FlaskApiContext.Provider>
  );
}

export default App;
