import React, { useState } from 'react';
import './OptionsPanel.css';

const OptionsPanel = ({ onProcessingStarted, processingStatus, loading, onModelRunning }) => {
    const [colorizerEnabled, setColorizerEnabled] = useState(false);
    const [translatorEnabled, setTranslatorEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState('model1');


    const flaskApiUrl = process.env.REACT_APP_FLASK_API_URL;

    const handleModelChange = (model) => {
        if (translatorEnabled) {
            setSelectedModel(model);
        }
    };

    const handleStartProcessing = async () => {
        const sessionId = sessionStorage.getItem('sessionKey');
        console.log("Processing with:", { colorizerEnabled, translatorEnabled, selectedModel, sessionId });
        
        // Call the function to set processing status and disable the button
        onProcessingStarted();

        try {
            const response = await fetch(`${flaskApiUrl}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    translator: translatorEnabled,
                    colorizer: colorizerEnabled,
                    model: selectedModel,
                    sessionId: sessionId,
                }),
            });

            if (response.ok) {
                console.log("Processing started successfully.");
                onModelRunning();
            } else {
                const errorData = await response.json();
                console.error("Error starting the processing:", response.statusText, errorData);
            }
        } catch (error) {
            console.error("Error during fetching:", error);
        }
    };

    return (
        <div className="options-panel">
            <div className="option-container">
                <div className="header">
                    <h3>Translator</h3>
                    <div 
                        className={`custom-toggler ${translatorEnabled ? 'enabled' : ''}`} 
                        onClick={() => setTranslatorEnabled(!translatorEnabled)}
                    >
                        {translatorEnabled ? 'ON' : 'OFF'}
                    </div>
                </div>
                <div className="model-buttons">
                    {['Google', 'Youdao', 'Baidu', 'DeepL', 'Papago', 'Sugoi', 'M2M100', 'M2M100_BIG'].map((model) => (
                        <button 
                            key={model} 
                            className={`model-button ${selectedModel === model ? 'selected' : ''}`} 
                            onClick={() => handleModelChange(model)}
                            disabled={!translatorEnabled || loading} // Disable if not enabled or loading
                        >
                            {model}
                        </button>
                    ))}
                </div>
                <p className="description">
                    Powered by the state-of-the-art translation model by <b>zyddnys</b>, found in the <b>manga-image-translator</b> repository.
                </p>
            </div>

            <div className="option-container">
                <div className="header">
                    <h3>Colorizer</h3>
                    <div 
                        className={`custom-toggler ${colorizerEnabled ? 'enabled' : ''}`} 
                        onClick={() => setColorizerEnabled(!colorizerEnabled)}
                    >
                        {colorizerEnabled ? 'ON' : 'OFF'}
                    </div>
                </div>
                <p className="description">
                    Utilizes the advanced colorization model developed by <b>qweasdd</b>, available at the <b>manga-colorization-v2</b> GitHub repository.
                </p>
            </div>

            <button 
                className="start-processing" 
                onClick={handleStartProcessing} 
                disabled={(!translatorEnabled && !colorizerEnabled) || loading} // Disable button if neither is enabled or loading
            >
                {loading ? 'Processing...' : 'Start Processing'} 
            </button>

            {processingStatus && <p className="status-message">{processingStatus}</p>}

        </div>
    );
};

export default OptionsPanel;
