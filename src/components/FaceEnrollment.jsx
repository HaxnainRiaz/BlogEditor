import React, { useState, useEffect } from 'react';
import { useFaceAuth } from '../contexts/FaceAuthContext';

const FaceEnrollment = ({ email, onComplete, onCancel }) => {
  const { 
    isEnrolling, 
    startEnrollment, 
    completeEnrollment, 
    stopCamera,
    isModelLoaded 
  } = useFaceAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const steps = [
    {
      title: "Position Your Face",
      description: "Ensure your face is clearly visible in the frame with good lighting",
      icon: "👤"
    },
    {
      title: "Stay Still",
      description: "Keep your face steady while we capture your facial data",
      icon: "⚡"
    },
    {
      title: "Complete Enrollment",
      description: "We're processing your facial data for secure authentication",
      icon: "✅"
    }
  ];

  useEffect(() => {
    if (isEnrolling) {
      setCurrentStep(1);
    }
  }, [isEnrolling]);

  const handleStartEnrollment = async () => {
    if (!isModelLoaded) {
      alert('Face recognition system is still loading. Please wait.');
      return;
    }

    const started = await startEnrollment();
    if (started) {
      setCurrentStep(1);
      
      // Start capture process after a brief delay
      setTimeout(async () => {
        setIsCapturing(true);
        const success = await completeEnrollment(email);
        setIsCapturing(false);
        
        if (success) {
          setCurrentStep(3);
          setTimeout(() => onComplete(true), 1500);
        } else {
          onComplete(false);
        }
      }, 2000);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="face-enrollment-modal">
      <div className="enrollment-content">
        <div className="enrollment-header">
          <h2>Face Recognition Setup</h2>
          <p>Secure your account with facial authentication</p>
        </div>

        <div className="enrollment-steps">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step-item ${currentStep > index ? 'completed' : ''} ${currentStep === index ? 'active' : ''}`}
            >
              <div className="step-icon">
                {currentStep > index ? '✅' : step.icon}
              </div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="enrollment-guidelines">
          <h4>For best results:</h4>
          <ul>
            <li>✅ Ensure good lighting on your face</li>
            <li>✅ Remove sunglasses or hats</li>
            <li>✅ Look directly at the camera</li>
            <li>✅ Maintain a neutral expression</li>
          </ul>
        </div>

        <div className="enrollment-actions">
          {currentStep === 0 && (
            <>
              <button 
                onClick={handleStartEnrollment}
                className="btn-primary"
                disabled={!isModelLoaded}
              >
                {isModelLoaded ? 'Start Face Enrollment' : 'Loading Face Recognition...'}
              </button>
              <button 
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </>
          )}
          
          {currentStep === 1 && isCapturing && (
            <div className="capturing-indicator">
              <div className="spinner"></div>
              <p>Capturing your facial data... Please stay still.</p>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h3>Enrollment Successful!</h3>
              <p>Your face has been registered for secure authentication.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceEnrollment;