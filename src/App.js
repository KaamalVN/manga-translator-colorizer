import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);
  const [mobileView, setMobileView] = useState('upload'); // For toggling views in mobile

  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };

  return (
    <div className="app">
      <header className="logo-header">
        <div className="logo">Manga Translator & Colorizer</div>
      </header>

      {/* Desktop layout */}
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
          />
        </div>
      </div>

      {/* Mobile layout */}
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
          />
        </div>
      </div>

      <div className="image-display-container">
        <ImageDisplay refreshImages={refreshImages} />
      </div>
    </div>
  );
}

export default App;
