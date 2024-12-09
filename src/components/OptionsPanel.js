import React, { useState, useContext } from 'react';
import { FlaskApiContext } from '../App';
import './OptionsPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';


const OptionsPanel = ({ onProcessingStarted, processingStatus, loading, onModelRunning }) => {
    const [colorizerEnabled, setColorizerEnabled] = useState(false);
    const [translatorEnabled, setTranslatorEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState('model1');
    const [apiKeys, setApiKeys] = useState({});
    const [showKeyInputs, setShowKeyInputs] = useState(false);
    const [keySectionMinimized, setKeySectionMinimized] = useState(false);

    const flaskApiUrl = useContext(FlaskApiContext);

    const models = {
        google: { requiresKey: false },
        youdao: { requiresKey: true, keyCount: 2, labels: ['YOUDAO_APP_KEY', 'YOUDAO_SECRET_KEY'] },
        baidu: { requiresKey: true, keyCount: 2, labels: ['BAIDU_APP_ID', 'BAIDU_SECRET_KEY'] },
        deepl: { requiresKey: true, keyCount: 1, labels: ['DEEPL_AUTH_KEY'] },
        caiyun: { requiresKey: true, keyCount: 1, labels: ['CAIYUN_TOKEN'] },
        gpt3: { requiresKey: true, keyCount: 1, labels: ['OPENAI_API_KEY'] },
        gpt3_5: { requiresKey: true, keyCount: 1, labels: ['OPENAI_API_KEY'] },
        gpt4: { requiresKey: true, keyCount: 1, labels: ['OPENAI_API_KEY'] },
        papago: { requiresKey: false },
        sakura: { requiresKey: true, keyCount: 1, labels: ['SAKURA_API_BASE'] },
        offline: { requiresKey: false },
        sugoi: { requiresKey: false },
        m2m100: { requiresKey: false },
        m2m100_big: { requiresKey: false },
    };

    const handleModelChange = (model) => {
        setSelectedModel(model);
        if (models[model].requiresKey) {
            setShowKeyInputs(true);
        } else {
            setShowKeyInputs(false);
        }
    };

    const handleKeyInputChange = (key, value) => {
        setApiKeys({ ...apiKeys, [key]: value });
    };

    const handleKeySectionToggle = () => {
        setKeySectionMinimized((prev) => !prev);
    };

    const handleStartProcessing = async () => {
        const sessionId = sessionStorage.getItem('sessionKey');
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
                    apiKeys: apiKeys,
                }),
            });

            if (response.ok) {
                onModelRunning();
            } else {
                const errorData = await response.json();
                console.error('Error starting the processing:', response.statusText, errorData);
            }
        } catch (error) {
            console.error('Error during fetching:', error);
        }
    };

    return (
        <div className="options-panel">
            {/* Translator Section */}
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
                    {Object.keys(models).map((model) => (
                        <button
                            key={model}
                            className={`model-button ${selectedModel === model ? 'selected' : ''}`}
                            onClick={() => handleModelChange(model)}
                            disabled={!translatorEnabled || loading}
                        >
                            {model}
                        </button>
                    ))}
                </div>
                {translatorEnabled && showKeyInputs && models[selectedModel].keyCount > 0 && (
                    <div className={`key-inputs ${keySectionMinimized ? 'minimized' : ''}`}>
                        <div className="key-header">
                            <h4>API Keys</h4>
                            <button className="key-toggle-button" onClick={handleKeySectionToggle}>
                                {keySectionMinimized ? (
                                    <>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faAngleUp} />
                                    </>
                                )}
                            </button>
                        </div>
                        {!keySectionMinimized &&
                            models[selectedModel].labels.map((label, index) => (
                                <div key={index} className="key-input-container">
                                    <label>{label.replace(/_/g, ' ').toLowerCase()}</label>
                                    <input
                                        type="text"
                                        onChange={(e) => handleKeyInputChange(label, e.target.value)}
                                        placeholder={`Enter ${label.replace(/_/g, ' ').toLowerCase()}`}
                                    />
                                </div>
                            ))}
                    </div>
                )}
                <p className="description">
                Powered by the state-of-the-art translation model by <b>zyddnys</b>, found in the <b>manga-image-translator</b> repository.
                </p>
            </div>

            {/* Colorizer Section */}
            <div className="option-container2">
                <div className="header">
                    <h3>Colorizer</h3>
                    <div
                        className={`custom-toggler ${colorizerEnabled ? 'enabled' : ''}`}
                        onClick={() => setColorizerEnabled(!colorizerEnabled)}
                    >
                        {colorizerEnabled ? 'ON' : 'OFF'}
                    </div>
                </div>
                <p className="description">Utilizes the advanced colorization model developed by <b>qweasdd</b>, available at the <b>manga-colorization-v2</b> GitHub repository.</p>
            </div>

            {/* Start Processing Button */}
            <button
                className="start-processing"
                onClick={handleStartProcessing}
                disabled={(!translatorEnabled && !colorizerEnabled) || loading}
            >
                {loading ? 'Processing...' : 'Start Processing'}
            </button>

            {processingStatus && <p className="status-message">{processingStatus}</p>}
        </div>
    );
};

export default OptionsPanel;



