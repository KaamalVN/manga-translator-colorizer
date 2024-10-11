import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);
  const [mobileView, setMobileView] = useState('upload'); // For toggling views in mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000); // Check if screen is mobile-sized

  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };

  // This function will be triggered when processing is started from OptionsPanel
  const handleProcessingStarted = () => {
    console.log('Processing started...');
    setRefreshImages((prev) => !prev); // For example, refresh images or do some action
  };

  // Update isMobile state based on screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app">
      <header className="logo-header">
        <div className="logo">Manga Translator & Colorizer</div>
      </header>

      {/* Conditional rendering based on whether it's mobile or not */}
      {isMobile ? (
        <>
          {/* Mobile Layout */}
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
            <div className={`mobile-box ${mobileView === 'upload' ? 'show' : 'hide'}`}>
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>
            <div className={`mobile-box ${mobileView === 'settings' ? 'show' : 'hide'}`}>
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted} // Pass the function as prop
              />
            </div>
          </div>
          <div className="image-display-container">
            <ImageDisplay refreshImages={refreshImages} />
          </div>
        </>
      ) : (
        <>
          {/* Desktop Layout */}
          <div className="content desktop-content">
            <div className="column left">
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>

            <div className="column middle">
              <ImageDisplay refreshImages={refreshImages} />
            </div>

            <div className="column right">
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted} // Pass the function as prop
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
