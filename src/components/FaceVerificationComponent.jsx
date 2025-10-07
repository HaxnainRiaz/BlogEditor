import React, { useState, useEffect, useRef } from 'react';
import { useFaceAuth } from '../contexts/FaceAuthContext';

// Import the same triangulation and drawing functions from FaceMeshPage
const TRIANGULATION = [
  127, 34, 139, 11, 0, 37, 232, 231, 120, 72, 37, 39, 128, 121, 47, 232,
  // ... (include the full TRIANGULATION array from your FaceMeshPage)
];

const FaceVerificationComponent = ({ 
  email, 
  onSuccess, 
  onCancel, 
  mode = 'verification', // 'enrollment' or 'verification'
  onStepUpdate 
}) => {
  const { 
    isEnrolling, 
    isVerifying, 
    enrollFace, 
    verifyFace, 
    startCamera, 
    stopCamera,
    videoRef,
    canvasRef,
    isModelLoaded
  } = useFaceAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('initializing');
  const [landmarks, setLandmarks] = useState(null);
  
  const displayCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: "Camera Access",
      description: "Allow camera access and position your face",
      status: 'pending'
    },
    {
      number: 2,
      title: "Face Detection",
      description: "Keep your face still for detection",
      status: 'pending'
    },
    {
      number: 3,
      title: mode === 'enrollment' ? "Face Enrollment" : "Face Verification",
      description: mode === 'enrollment' 
        ? "Saving your facial data securely" 
        : "Matching with stored facial data",
      status: 'pending'
    }
  ];

  // Convert normalized landmarks to pixel coordinates
  const normalizedToPixels = (landmarks, width, height) =>
    landmarks.map((pt) => ({
      x: pt.x * width,
      y: pt.y * height,
      z: pt.z || 0,
    }));

  // Draw triangular mesh (same as FaceMeshPage)
  const drawTriangularMesh = (ctx, landmarksPx, triangulation, options = {}) => {
    const {
      fillStyle = "rgba(0,255,136,0.15)",
      stroke = "rgba(0,255,136,0.6)",
      strokeWidth = 0.8,
    } = options;

    for (let i = 0; i < triangulation.length; i += 3) {
      const a = triangulation[i];
      const b = triangulation[i + 1];
      const c = triangulation[i + 2];
      
      const pA = landmarksPx[a];
      const pB = landmarksPx[b];
      const pC = landmarksPx[c];
      
      if (!pA || !pB || !pC) continue;

      const avgZ = ((pA.z || 0) + (pB.z || 0) + (pC.z || 0)) / 3;
      const depthFactor = Math.max(0.1, Math.min(1, 1 - (avgZ + 0.3)));
      const fillAlpha = 0.1 + 0.1 * depthFactor;
      const fillColor = `rgba(0,255,136,${fillAlpha.toFixed(3)})`;

      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.closePath();
      
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  };

  // Draw landmarks
  const drawLandmarks = (ctx, landmarksPx) => {
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.8;
    
    landmarksPx.forEach(point => {
      if (point && !isNaN(point.x) && !isNaN(point.y)) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    ctx.globalAlpha = 1;
  };

  // Animation loop for drawing mesh
  const startFaceDetection = async () => {
    if (!videoRef.current || !displayCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = displayCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const detectFrame = async () => {
      if (video.readyState === 4) {
        // Set canvas size to match video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Update step to face detection
        if (currentStep === 1) {
          setCurrentStep(2);
          setStatus('detecting');
          if (onStepUpdate) onStepUpdate(2);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  // Start the verification/enrollment process
  const startProcess = async () => {
    try {
      setStatus('initializing');
      setCurrentStep(1);
      if (onStepUpdate) onStepUpdate(1);

      // Step 1: Start camera
      const cameraStarted = await startCamera();
      if (!cameraStarted) {
        throw new Error('Failed to start camera');
      }

      // Start face detection visualization
      await new Promise(resolve => setTimeout(resolve, 1000));
      startFaceDetection();

      // Step 2 & 3: Perform enrollment or verification
      setCurrentStep(3);
      setStatus('processing');
      if (onStepUpdate) onStepUpdate(3);

      let result;
      if (mode === 'enrollment') {
        result = await enrollFace(email);
      } else {
        result = await verifyFace(email);
      }

      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess(result);
        }, 1000);
      } else {
        throw new Error('Process failed');
      }

    } catch (error) {
      console.error(`${mode} error:`, error);
      setStatus('error');
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  useEffect(() => {
    if (isModelLoaded) {
      startProcess();
    }

    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelLoaded]);

  const getStatusColor = (stepNumber) => {
    if (stepNumber < currentStep) return 'bg-green-500';
    if (stepNumber === currentStep) {
      if (status === 'error') return 'bg-red-500';
      return 'bg-blue-500 animate-pulse';
    }
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    switch (status) {
      case 'initializing': return 'Initializing camera...';
      case 'detecting': return 'Detecting face...';
      case 'processing': 
        return mode === 'enrollment' ? 'Enrolling face...' : 'Verifying face...';
      case 'success': 
        return mode === 'enrollment' ? 'Enrollment successful!' : 'Verification successful!';
      case 'error': return 'Process failed. Please try again.';
      default: return 'Ready to start...';
    }
  };

  return (
    <div className="face-verification-container">
      <div className="verification-steps">
        {steps.map((step) => (
          <div key={step.number} className="step-item">
            <div className={`step-number ${getStatusColor(step.number)}`}>
              {step.number}
            </div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="camera-preview">
        <canvas 
          ref={displayCanvasRef}
          className="camera-canvas"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        />
      </div>

      <div className="verification-status">
        <div className={`status-indicator ${status}`}>
          {getStatusText()}
        </div>
      </div>

      <div className="verification-actions">
        <button 
          onClick={onCancel}
          className="btn-secondary"
          disabled={status === 'processing'}
        >
          Cancel
        </button>
        
        {status === 'error' && (
          <button 
            onClick={startProcess}
            className="btn-primary"
          >
            Try Again
          </button>
        )}
      </div>

      <style jsx>{`
        .face-verification-container {
          padding: 2rem;
          text-align: center;
          color: white;
        }
        
        .verification-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }
        
        .step-content {
          text-align: left;
        }
        
        .step-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }
        
        .step-content p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.8;
        }
        
        .camera-preview {
          margin: 2rem 0;
        }
        
        .verification-status {
          margin: 1rem 0;
        }
        
        .status-indicator {
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
        }
        
        .status-indicator.success {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        
        .status-indicator.error {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }
        
        .status-indicator.processing {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }
        
        .verification-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
          .verification-steps {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .step-item {
            justify-content: center;
            text-align: center;
          }
          
          .step-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FaceVerificationComponent;