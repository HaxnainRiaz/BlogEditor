import React, { useState, useEffect } from 'react';
import { useFaceAuth } from '../contexts/FaceAuthContext';

const FaceVerification = ({ email, onSuccess, onCancel, onUsePassword }) => {
  const { 
    isVerifying, 
    verifyFace, 
    stopCamera,
    isModelLoaded 
  } = useFaceAuth();
  
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, failed
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    startVerification();
  }, []);

  const startVerification = async () => {
    setVerificationStatus('verifying');
    
    const success = await verifyFace(email);
    
    if (success) {
      setVerificationStatus('success');
      setTimeout(() => onSuccess(), 1000);
    } else {
      setVerificationStatus('failed');
      setAttempts(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setVerificationStatus('verifying');
    startVerification();
  };

  const handleUsePassword = () => {
    stopCamera();
    onUsePassword();
  };

  return (
    <div className="face-verification-modal">
      <div className="verification-content">
        <div className="verification-header">
          <h2>Face Verification</h2>
          <p>Look at the camera to verify your identity</p>
        </div>

        <div className="verification-status">
          {verificationStatus === 'verifying' && (
            <div className="status-verifying">
              <div className="spinner large"></div>
              <h3>Verifying Your Face...</h3>
              <p>Please look directly at the camera</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="status-success">
              <div className="success-icon">✅</div>
              <h3>Verification Successful!</h3>
              <p>Identity confirmed. Redirecting...</p>
            </div>
          )}
          
          {verificationStatus === 'failed' && (
            <div className="status-failed">
              <div className="failed-icon">❌</div>
              <h3>Verification Failed</h3>
              <p>We couldn't verify your face. Attempt {attempts} of 3.</p>
              
              <div className="verification-actions">
                {attempts < 3 ? (
                  <>
                    <button onClick={handleRetry} className="btn-primary">
                      Try Again
                    </button>
                    <button onClick={handleUsePassword} className="btn-secondary">
                      Use Password Instead
                    </button>
                  </>
                ) : (
                  <>
                    <p className="attempts-exceeded">
                      Maximum attempts reached. Please use password login.
                    </p>
                    <button onClick={handleUsePassword} className="btn-primary">
                      Use Password Login
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="verification-guidelines">
          <h4>Tips for better verification:</h4>
          <ul>
            <li>✅ Ensure good lighting</li>
            <li>✅ Look directly at the camera</li>
            <li>✅ Keep a neutral expression</li>
            <li>✅ Remove obstructions (glasses, hats)</li>
          </ul>
        </div>

        <div className="verification-actions">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceVerification;