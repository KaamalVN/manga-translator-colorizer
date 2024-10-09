import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import OptionsPanel from './components/OptionsPanel';

function App() {
  const [selectedMode, setSelectedMode] = useState({ translator: false, colorizer: false });
  const [translatorModel, setTranslatorModel] = useState('');
  const [refreshImages, setRefreshImages] = useState(false);

  const handleFilesAdded = () => {
    setRefreshImages((prev) => !prev);
  };
  return (
    <div className="app">
      <header className="header">
        <div className="logo">Manga Translator & Colorizer</div>
      </header>

      <div className="content">
        <div className="column left">
          <ImageUploader onFilesAdded={handleFilesAdded} />
        </div>

        <div className="column middle">
          <ImageDisplay refreshImages={refreshImages}/>
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
    </div>
  );
}

export default App;
