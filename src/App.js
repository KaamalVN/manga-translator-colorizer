import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);
  const [mobileView, setMobileView] = useState('upload');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [processingStatus, setProcessingStatus] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the process button

  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };

  const handleProcessingStarted = () => {
    console.log('Processing started...');
    setProcessingStatus('Processing started...');
    setLoading(true); // Disable the processing button
  };

  const handleModelRunning = () => {
    setProcessingStatus('Model running...');
    //setRefreshImages(true); // Trigger image refresh
    setRefreshImages((prev) => !prev);
  };

  const handleProcessingComplete = () => {
    console.log('Processing completed with images:');
    setProcessingStatus(''); // Reset the processing status
    setLoading(false); // Enable the processing button
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

  return (
    <div className="app">
      <header className="logo-header">
        <div className="logo">Manga Translator & Colorizer</div>
      </header>

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
            <div className={`mobile-box ${mobileView === 'upload' ? 'show' : 'hide'}`}>
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>
            <div className={`mobile-box ${mobileView === 'settings' ? 'show' : 'hide'}`}>
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted}
                processingStatus={processingStatus}
                loading={loading} // Pass loading state
                onModelRunning={handleModelRunning} 
              />
            </div>
          </div>
          <div className="image-display-container">
            <ImageDisplay refreshImages={refreshImages} onProcessingComplete={handleProcessingComplete} />
          </div>
        </>
      ) : (
        <>
          <div className="content desktop-content">
            <div className="column left">
              <ImageUploader onFilesAdded={handleFilesAdded} />
            </div>
            <div className="column middle">
              <ImageDisplay refreshImages={refreshImages} onProcessingComplete={handleProcessingComplete} />
            </div>
            <div className="column right">
              <OptionsPanel
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                translatorModel={translatorModel}
                setTranslatorModel={setTranslatorModel}
                onProcessingStarted={handleProcessingStarted}
                processingStatus={processingStatus}
                loading={loading} // Pass loading state
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
