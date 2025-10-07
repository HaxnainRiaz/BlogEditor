import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { toast } from 'react-toastify';

const FaceAuthContext = createContext();

export const useFaceAuth = () => {
  const context = useContext(FaceAuthContext);
  if (!context) {
    throw new Error('useFaceAuth must be used within a FaceAuthProvider');
  }
  return context;
};

export const FaceAuthProvider = ({ children }) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const faceLandmarkerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize face landmarker
  useEffect(() => {
    const initFaceLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );
        
        setIsModelLoaded(true);
        console.log('Face landmarker model loaded successfully');
      } catch (error) {
        console.error('Error loading face landmarker:', error);
        toast.error('Failed to load face recognition system');
      }
    };

    initFaceLandmarker();

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  // Extract face embeddings from landmarks
  const extractFaceEmbedding = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;
    
    // Simple embedding extraction - in production, you'd use a more sophisticated method
    const embedding = landmarks.flatMap(landmark => [landmark.x, landmark.y, landmark.z || 0]);
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  };

  // Calculate similarity between two embeddings
  const calculateSimilarity = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) return 0;
    
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    return dotProduct; // Cosine similarity since embeddings are normalized
  };

  // Start face enrollment process
  const startEnrollment = async () => {
    if (!isModelLoaded) {
      toast.error('Face recognition system not ready yet');
      return false;
    }

    try {
      setIsEnrolling(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      return true;
    } catch (error) {
      console.error('Error starting enrollment:', error);
      toast.error('Cannot access camera. Please check permissions.');
      setIsEnrolling(false);
      return false;
    }
  };

  // Capture face data for enrollment
  const captureFaceData = async () => {
    if (!faceLandmarkerRef.current || !videoRef.current) {
      throw new Error('Face recognition system not ready');
    }

    const results = await faceLandmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      throw new Error('No face detected. Please ensure your face is clearly visible.');
    }

    const landmarks = results.faceLandmarks[0];
    const embedding = extractFaceEmbedding(landmarks);
    
    if (!embedding) {
      throw new Error('Failed to extract face data');
    }

    return {
      embedding,
      timestamp: Date.now(),
      landmarks: landmarks.slice(0, 10) // Store first 10 landmarks for verification
    };
  };

  // Complete enrollment with multiple samples
  const completeEnrollment = async (email) => {
    try {
      const samples = [];
      
      // Capture multiple samples for better accuracy
      for (let i = 0; i < 3; i++) {
        toast.info(`Capturing face sample ${i + 1}/3...`);
        
        // Wait for stable face detection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const faceData = await captureFaceData();
        samples.push(faceData);
        
        // Small delay between samples
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Calculate average embedding
      const avgEmbedding = samples[0].embedding.map((_, index) => {
        return samples.reduce((sum, sample) => sum + sample.embedding[index], 0) / samples.length;
      });

      const enrollmentData = {
        email,
        embedding: avgEmbedding,
        samples: samples.length,
        enrolledAt: Date.now()
      };

      // Store in localStorage (in production, this would go to your backend)
      const existingData = JSON.parse(localStorage.getItem('faceAuthData') || '{}');
      existingData[email] = enrollmentData;
      localStorage.setItem('faceAuthData', JSON.stringify(existingData));

      setIsEnrolling(false);
      stopCamera();
      
      toast.success('Face enrollment completed successfully!');
      return true;

    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'Face enrollment failed');
      setIsEnrolling(false);
      return false;
    }
  };

  // Verify face against enrolled data
  const verifyFace = async (email) => {
    if (!isModelLoaded) {
      toast.error('Face recognition system not ready yet');
      return false;
    }

    try {
      setIsVerifying(true);
      
      // Get enrolled data
      const faceAuthData = JSON.parse(localStorage.getItem('faceAuthData') || '{}');
      const enrolledData = faceAuthData[email];
      
      if (!enrolledData) {
        throw new Error('No face data found for this user. Please enroll first.');
      }

      // Start camera for verification
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Attempt verification multiple times
      let verificationSuccess = false;
      let attempts = 0;
      const maxAttempts = 5;

      while (!verificationSuccess && attempts < maxAttempts) {
        attempts++;
        
        try {
          const currentFaceData = await captureFaceData();
          const similarity = calculateSimilarity(
            enrolledData.embedding,
            currentFaceData.embedding
          );

          console.log(`Verification attempt ${attempts}, similarity: ${similarity}`);

          // Threshold for face matching (adjust based on your needs)
          if (similarity > 0.85) {
            verificationSuccess = true;
            break;
          }

          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.warn(`Verification attempt ${attempts} failed:`, error.message);
        }
      }

      setIsVerifying(false);
      stopCamera();

      if (verificationSuccess) {
        toast.success('Face verification successful!');
        return true;
      } else {
        toast.error('Face verification failed. Please try again.');
        return false;
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Face verification failed');
      setIsVerifying(false);
      stopCamera();
      return false;
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Check if user has face data enrolled
  const hasFaceData = (email) => {
    const faceAuthData = JSON.parse(localStorage.getItem('faceAuthData') || '{}');
    return !!faceAuthData[email];
  };

  const value = {
    isEnrolling,
    isVerifying,
    isModelLoaded,
    faceData,
    startEnrollment,
    completeEnrollment,
    verifyFace,
    hasFaceData,
    stopCamera,
    videoRef,
    canvasRef
  };

  return (
    <FaceAuthContext.Provider value={value}>
      {children}
      {/* Hidden video element for face processing */}
      <video 
        ref={videoRef} 
        style={{ display: 'none' }} 
        playsInline
      />
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </FaceAuthContext.Provider>
  );
};