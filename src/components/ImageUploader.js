import React, { useState, useEffect } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onFilesAdded }) => {
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    const flaskApiUrl = process.env.REACT_APP_FLASK_API_URL;

    useEffect(() => {
        const sessionKey = sessionStorage.getItem('sessionKey');
        if (!sessionKey) {
            const newSessionKey = 'session_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionKey', newSessionKey);
        }
    }, []);

    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) {
            uploadFiles(files);
        }
    };

    const handleFileInputChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadFiles(files);
        }
    };

    const uploadFiles = (files) => {
        setLoading(true); // Set loading to true when upload starts
        const sessionId = sessionStorage.getItem('sessionKey');
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        formData.append('sessionId', sessionId);

        fetch(`${flaskApiUrl}/upload`, {
            method: 'POST',
            mode: 'cors',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            return response.json();
        })
        .then(data => {
            console.log("Upload successful:", data);
            onFilesAdded(); // Notify parent component about the upload completion
            setLoading(false); // Stop loading when done
        })
        .catch(error => {
            console.error("Error:", error);
            setError("Failed to upload images.");
            setLoading(false); // Stop loading in case of error
        });
    };

    const handleSubmitLink = (event) => {
        event.preventDefault();
        const sessionId = sessionStorage.getItem('sessionKey');
        if (!link) {
            setError('Please enter a link');
            return;
        }
        
        setLoading(true); // Set loading to true when link submission starts

        // Send the GET request without waiting for a response
        fetch(`${flaskApiUrl}/download?url=${encodeURIComponent(link)}&sessionId=${sessionId}`, {
            method: 'GET',
        })
        .then(() => {
            // Start polling for status immediately after sending the request
            const statusCheckInterval = setInterval(async () => {
                const statusResponse = await fetch(`${flaskApiUrl}/download-status/${sessionId}`);
                const statusData = await statusResponse.json();

                if (statusData.status === 'completed') {
                    clearInterval(statusCheckInterval);
                    const filesResponse = await fetch(`${flaskApiUrl}/download?url=${encodeURIComponent(link)}&sessionId=${sessionId}`, {
                        method: 'GET',
                    });
                    const filesData = await filesResponse.json();
                    onFilesAdded(filesData.files); // Notify parent with file data
                    setLoading(false); // Stop loading when done
                } else if (statusData.status === 'failed') {
                    clearInterval(statusCheckInterval);
                    setError('Failed to upload images.');
                    setLoading(false); // Stop loading in case of error
                }
            }, 2000); // Check every 2 seconds
        })
        .catch(err => {
            setError(err.message);
            setLoading(false); // Stop loading in case of error
        });
    };

    return (
        <div className="image-uploader">
            <div className="row">
                <h3>Choose or Drag & Drop Images</h3>
                <div 
                    className="drop-area" 
                    onDrop={handleFileDrop} 
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input 
                        type="file" 
                        accept="image/jpeg" 
                        multiple 
                        onChange={handleFileInputChange} 
                        style={{ display: 'none' }} 
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                        Drag & Drop your files here or click to select
                    </label>
                </div>
            </div>
            <div className="row">
                <h3>Paste Manga Link</h3>
                <textarea 
                    rows="4" 
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                    placeholder="Enter main manga page link or single chapter link..."
                    className="link-input"
                />
                <button onClick={handleSubmitLink} className="submit-link">Submit Link</button>
            </div>
            
            {/* Show loading message */}
            {loading && <div className="loading-message">Uploading, please wait...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ImageUploader;
