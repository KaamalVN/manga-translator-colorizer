import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';
import Joyride from 'react-joyride';  // Import Joyride
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);
  const [mobileView, setMobileView] = useState('upload');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [processingStatus, setProcessingStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);  // State for running tutorial

  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };

  const handleProcessingStarted = () => {
    console.log('Processing started...');
    setProcessingStatus('Processing started...');
    setLoading(true);
  };

  const handleModelRunning = () => {
    setProcessingStatus('Model running...');
    setRefreshImages((prev) => !prev);
  };

  const handleProcessingComplete = () => {
    console.log('Processing completed with images:');
    setProcessingStatus('');
    setLoading(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const steps = [
    {
      target: '.drop-area', // Class name for ImageUploader
      content: 'Upload images locally by dragging and dropping them into this area.',
    },
    {
      target: '.link-input', // Class name for OptionsPanel
      content: 'Enter the link to a manga page, a single chapter, or the entire manga here.',
    },
    {
      target: '.submit-link', // Class name for ImageDisplay
      content: 'Click this button only if you are uploading images via a link.',
    },
    {
      target: '.option-container', // Class name for OptionsPanel
      content: 'Enable the translator and select your desired model from this section.',
    },
    {
      target: '.option-container2', // Class name for OptionsPanel
      content: 'Here, you can enable the colorizer for your images.',
    },
    {
      target: '.start-processing', // Class name for OptionsPanel
      content: 'This button will only be enabled if you select at least one of the options above.',
    },
  ];

  const mobileSteps = [
    {
      target: '.drop-area', // Class name for ImageUploader
      content: 'Upload images locally by dragging and dropping them into this area.',
    },
    {
      target: '.link-input', // Class name for OptionsPanel
      content: 'Enter the link to a manga page, a single chapter, or the entire manga here.',
    },
    {
      target: '.submit-link', // Class name for ImageDisplay
      content: 'Click this button only if you are uploading images via a link.',
    },
    {
      target: '.mobile-toggle-container', // Class name for ImageDisplay
      content: 'Here, you can toggle between upload part and the settings.',
    },
    {
      target: '.option-container', // Class name for OptionsPanel
      content: 'Enable the translator and select your desired model from this section.',
    },
    {
      target: '.option-container2', // Class name for OptionsPanel
      content: 'Here, you can enable the colorizer for your images.',
    },
    {
      target: '.start-processing', // Class name for OptionsPanel
      content: 'This button will only be enabled if you select at least one of the options above.',
    },
  ];

  
  

  return (
    <div className="app">
      <header className="logo-header">
        <div className="logo">Manga Translator & Colorizer</div>
        <button 
          className="tutorial-button" 
          onClick={() => setRunTutorial(true)} // Start the tutorial
        >
          <FontAwesomeIcon icon={faQuestionCircle} size="2x" />
        </button>
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
        }}
        callback={(data) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setMobileView('upload')
            setRunTutorial(false);  // Stop the tutorial on finish or skip
          }
              // Check if the step index is the one that requires changing the mobile view
          if (data.action === 'next' && data.index === 3) {
            setMobileView('settings'); // Change to settings view
          }
        }}
      />

      {isMobile ? (
        <>
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
  );
}

export default App;
