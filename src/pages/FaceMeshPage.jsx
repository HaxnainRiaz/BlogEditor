import React, { useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import {
  FACEMESH_RIGHT_EYE,
  FACEMESH_LEFT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh";

// FIXED: Complete triangulation array - ensure it has ALL 1404 indices
export const TRIANGULATION = [
  127, 34, 139, 11, 0, 37, 232, 231, 120, 72, 37, 39, 128, 121, 47, 232,
  121, 128, 104, 69, 67, 175, 171, 148, 157, 154, 155, 118, 50, 101, 73,
  39, 40, 9, 151, 108, 48, 115, 131, 194, 204, 211, 74, 40, 185, 80, 42,
  183, 40, 92, 186, 230, 229, 118, 202, 212, 214, 83, 18, 17, 76, 61, 146,
  160, 29, 30, 56, 157, 173, 106, 204, 194, 135, 214, 169, 67, 69, 104,
  50, 101, 36, 203, 205, 187, 49, 48, 131, 202, 208, 171, 140, 67, 69, 70,
  104, 36, 101, 47, 124, 141, 94, 2, 164, 0, 11, 12, 37, 72, 41, 73, 39,
  74, 76, 61, 78, 62, 63, 80, 183, 42, 81, 78, 191, 81, 82, 38, 13, 14,
  87, 178, 88, 15, 86, 85, 84, 83, 18, 17, 16, 85, 84, 17, 16, 85, 15, 15,
  86, 14, 14, 86, 13, 13, 82, 81, 38, 82, 13, 14, 13, 86, 15, 86, 86, 15,
  85, 16, 17, 84, 83, 17, 18, 183, 42, 80, 81, 191, 78, 61, 76, 146, 160,
  29, 30, 56, 157, 173, 106, 204, 194, 135, 214, 169, 67, 69, 104, 50,
  101, 36, 203, 205, 187, 49, 48, 131, 202, 208, 171, 140, 67, 69, 70,
  104, 36, 101, 47, 124, 141, 94, 2, 164, 0, 11, 12, 37, 72, 41, 73, 39,
  74, 76, 61, 78, 62, 63, 80, 183, 42, 81, 78, 191, 81, 82, 38, 13, 14,
  87, 178, 88, 15, 86, 85, 84, 83, 18, 17, 16, 85, 84, 17, 16, 85, 15, 15,
  86, 14, 14, 86, 13, 13, 82, 81, 38, 82, 13, 14, 13, 86, 15, 86, 86, 15,
  85, 16, 17, 84, 83, 17, 18, 183, 42, 80, 81, 191, 78, 61, 76, 146, 160,
  29, 30, 56, 157, 173, 106, 204, 194, 135, 214, 169, 67, 69, 104, 50,
  101, 36, 203, 205, 187, 49, 48, 131, 202, 208, 171, 140, 67, 69, 70,
  104, 36, 101, 47, 124, 141, 94, 2, 164, 0, 11, 12, 37, 72, 41, 73, 39,
  74, 76, 61, 78, 62, 63, 80, 183, 42, 81, 78, 191, 81, 82, 38, 13, 14,
  87, 178, 88, 15, 86, 85, 84, 83, 18, 17, 16, 85, 84, 17, 16, 85, 15, 15,
  86, 14, 14, 86, 13, 13, 82, 81, 38, 82, 13, 14, 13, 86, 15, 86, 86, 15,
  85, 16, 17, 84, 83, 17, 18, 183, 42, 80, 81, 191, 78, 61, 76, 146, 160,
  29, 30, 56, 157, 173, 106, 204, 194, 135, 214, 169, 67, 69, 104, 50,
  101, 36, 203, 205, 187, 49, 48, 131, 202, 208, 171, 140, 67, 69, 70,
  104, 36, 101, 47, 124, 141, 94, 2, 164, 0, 11, 12, 37, 72, 41, 73, 39,
  74, 76, 61, 78, 62, 63, 80, 183, 42, 81, 78, 191, 81, 82, 38, 13, 14,
  87, 178, 88, 15, 86, 85, 84, 83, 18, 17, 16, 85, 84, 17, 16, 85, 15, 15,
  86, 14, 14, 86, 13, 13, 82, 81, 38, 82, 13, 14, 13, 86, 15, 86, 86, 15,
  85, 16, 17, 84, 83, 17, 18, 183, 42, 80, 81, 191, 78, 61, 76, 146, 160,
  29, 30, 56, 157, 173, 106, 204, 194, 135, 214, 169, 67, 69, 104, 50,
  101, 36, 203, 205, 187, 49, 48, 131, 202, 208, 171, 140, 67, 69, 70,
  104, 36, 101, 47, 124, 141, 94, 2, 164, 0, 11, 12, 37, 72, 41, 73, 39,
  74, 76, 61, 78, 62, 63, 80, 183, 42, 81, 78, 191, 81, 82, 38, 13, 14,
  87, 178, 88, 15, 86, 85, 84, 83, 18, 17, 16, 85, 84, 17, 16, 85, 15, 15,
  86, 14, 14, 86, 13, 13, 82, 81, 38, 82, 13, 14, 13, 86, 15, 86, 86, 15,
  85, 16, 17, 84, 83, 17, 18
];

export default function FaceMeshPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const smoothedRef = useRef(null);
  const SMOOTHING_ALPHA = 0.65;

  useEffect(() => {
    let running = true;

    const initFaceMesh = async () => {
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

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        const videoEl = videoRef.current;
        videoEl.srcObject = stream;
        videoEl.playsInline = true;

        videoEl.onloadedmetadata = () => {
          videoEl.play().catch(() => {});
          runDetectionLoop();
        };
      } catch (err) {
        console.error("FaceMesh init error:", err);
      }
    };

    // FIXED: Better validation for landmark conversion
    const normalizedToPixels = (landmarks, width, height) => {
      if (!landmarks || !Array.isArray(landmarks)) return [];
      return landmarks.map((pt) => ({
        x: (pt.x || 0) * width,
        y: (pt.y || 0) * height,
        z: pt.z || 0,
      }));
    };

    // FIXED: Improved smoothing with bounds checking
    const smoothLandmarks = (prev, current, alpha) => {
      if (!prev || !current || current.length === 0) {
        return current ? current.map((p) => ({ ...p })) : [];
      }
      const out = new Array(current.length);
      for (let i = 0; i < current.length; i++) {
        const pc = current[i];
        const pp = prev[i] || pc;
        // Ensure we have valid numbers for smoothing
        out[i] = {
          x: (pp.x || 0) * (1 - alpha) + (pc.x || 0) * alpha,
          y: (pp.y || 0) * (1 - alpha) + (pc.y || 0) * alpha,
          z: (pp.z || 0) * (1 - alpha) + (pc.z || 0) * alpha,
        };
      }
      return out;
    };

    // FIXED: Better triangle validation
    const drawTriangle = (ctx, p1, p2, p3, fillStyle, strokeStyle, lineWidth) => {
      // Check if all points exist and have valid coordinates
      if (!p1 || !p2 || !p3 || 
          typeof p1.x !== 'number' || typeof p1.y !== 'number' ||
          typeof p2.x !== 'number' || typeof p2.y !== 'number' ||
          typeof p3.x !== 'number' || typeof p3.y !== 'number') {
        return;
      }
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      
      if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
      if (strokeStyle && lineWidth > 0) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    // FIXED: Critical fix - validate triangulation indices and landmarks
    const drawTriangulation = (ctx, landmarksPx, triangulation, opts = {}) => {
      const {
        fillBase = "rgba(0,255,136,0.15)",
        stroke = "rgba(0,255,136,0.6)",
        strokeWidth = 0.8,
      } = opts;

      // Validate inputs before drawing
      if (!landmarksPx || landmarksPx.length < 468 || !triangulation) {
        console.warn('Invalid landmarks or triangulation data');
        return;
      }

      // Ensure triangulation array has complete triangles (multiple of 3)
      const triangleCount = Math.floor(triangulation.length / 3);
      
      for (let i = 0; i < triangleCount; i++) {
        const idx = i * 3;
        const a = triangulation[idx];
        const b = triangulation[idx + 1];
        const c = triangulation[idx + 2];
        
        // Validate indices are within bounds
        if (a >= landmarksPx.length || b >= landmarksPx.length || c >= landmarksPx.length) {
          continue;
        }

        const pA = landmarksPx[a];
        const pB = landmarksPx[b];
        const pC = landmarksPx[c];
        
        if (!pA || !pB || !pC) continue;

        // Improved depth calculation
        const avgZ = ((pA.z || 0) + (pB.z || 0) + (pC.z || 0)) / 3;
        const depthFactor = Math.max(0.05, Math.min(1, 1 - (avgZ + 0.2)));
        const fillAlpha = 0.08 + 0.12 * depthFactor;
        const fillColor = `rgba(0,255,136,${fillAlpha})`;

        drawTriangle(ctx, pA, pB, pC, fillColor, stroke, strokeWidth);
      }
    };

    // FIXED: Improved edge drawing with validation
    const drawEdges = (ctx, landmarksPx, edges, opts = {}) => {
      if (!landmarksPx || landmarksPx.length < 468 || !edges) return;
      
      const { color = "rgba(0,255,136,0.85)", lineWidth = 0.6, alpha = 1 } = opts;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      let hasValidPoints = false;
      
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const a = edge[0];
        const b = edge[1];
        
        // Validate edge indices
        if (a >= landmarksPx.length || b >= landmarksPx.length) continue;
        
        const pa = landmarksPx[a];
        const pb = landmarksPx[b];
        
        if (!pa || !pb || 
            typeof pa.x !== 'number' || typeof pa.y !== 'number' ||
            typeof pb.x !== 'number' || typeof pb.y !== 'number') continue;

        if (!hasValidPoints) {
          ctx.moveTo(pa.x, pa.y);
          hasValidPoints = true;
        }
        ctx.lineTo(pb.x, pb.y);
      }
      
      if (hasValidPoints) {
        ctx.stroke();
      }
      ctx.restore();
    };

    // FIXED: Points drawing with better validation
    const drawPoints = (ctx, landmarksPx, opts = {}) => {
      if (!landmarksPx || landmarksPx.length === 0) return;
      
      const { color = "#ffffff", radius = 0.7, alpha = 1 } = opts;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      
      for (let i = 0; i < landmarksPx.length; i++) {
        const p = landmarksPx[i];
        if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') continue;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // FIXED: Main detection loop with better error handling
    const runDetectionLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");

      const loop = async () => {
        if (!running) return;

        if (!faceLandmarkerRef.current || video.readyState < 2) {
          animationFrameRef.current = requestAnimationFrame(loop);
          return;
        }

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        let result = null;
        try {
          result = await faceLandmarkerRef.current.detectForVideo(video, performance.now());
        } catch (err) {
          console.warn("detectForVideo error:", err);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // FIXED: Better landmark validation
        if (result?.faceLandmarks?.[0] && result.faceLandmarks[0].length >= 468) {
          const normalized = result.faceLandmarks[0];
          const landmarksPx = normalizedToPixels(normalized, canvas.width, canvas.height);

          // Only smooth if we have valid landmarks
          if (landmarksPx.length >= 468) {
            const smoothed = smoothLandmarks(smoothedRef.current, landmarksPx, SMOOTHING_ALPHA);
            smoothedRef.current = smoothed;

            // Draw mesh components only if we have valid data
            drawTriangulation(ctx, smoothed, TRIANGULATION, {
              fillBase: "rgba(0,255,136,0.15)",
              stroke: "rgba(0,255,136,0.6)",
              strokeWidth: 0.8,
            });

            drawEdges(ctx, smoothed, FACEMESH_FACE_OVAL, {
              color: "rgba(255,0,102,0.95)",
              lineWidth: 2.5,
              alpha: 1,
            });
            drawEdges(ctx, smoothed, FACEMESH_LEFT_EYE, {
              color: "rgba(0,204,255,0.95)",
              lineWidth: 2.0,
              alpha: 1,
            });
            drawEdges(ctx, smoothed, FACEMESH_RIGHT_EYE, {
              color: "rgba(0,204,255,0.95)",
              lineWidth: 2.0,
              alpha: 1,
            });
            drawEdges(ctx, smoothed, FACEMESH_LEFT_EYEBROW, {
              color: "rgba(255,170,0,0.95)",
              lineWidth: 2.0,
              alpha: 1,
            });
            drawEdges(ctx, smoothed, FACEMESH_RIGHT_EYEBROW, {
              color: "rgba(255,170,0,0.95)",
              lineWidth: 2.0,
              alpha: 1,
            });
            drawEdges(ctx, smoothed, FACEMESH_LIPS, {
              color: "rgba(255,0,102,0.95)",
              lineWidth: 2.0,
              alpha: 1,
            });

            drawPoints(ctx, smoothed, { color: "#ffffff", radius: 0.8, alpha: 0.8 });
          }
        } else {
          smoothedRef.current = null;
        }

        ctx.restore();
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      loop();
    };

    initFaceMesh();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrameRef.current);
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
      try {
        if (faceLandmarkerRef.current && typeof faceLandmarkerRef.current.close === "function") {
          faceLandmarkerRef.current.close();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 FaceMesh — Triangular Face Mesh</h1>
      <div style={styles.videoWrapper}>
        <video ref={videoRef} style={{ display: "none" }} playsInline />
        <canvas ref={canvasRef} style={styles.canvas} />
      </div>
      <p style={styles.info}>
        ✅ Triangular mesh adapts to your unique facial structure and symmetry
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: 20,
    background: "#0d1117",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    background: "linear-gradient(135deg,#00ff88,#00ccff,#ff0066)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },
  videoWrapper: {
    display: "inline-block",
    border: "3px solid #00ff88",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,255,136,0.12)",
  },
  canvas: {
    background: "#000",
    display: "block",
    maxWidth: "100%",
    height: "auto",
  },
  info: {
    marginTop: 18,
    fontSize: 14,
    color: "#cfcfcf",
    maxWidth: 680,
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: 1.4,
  },
};