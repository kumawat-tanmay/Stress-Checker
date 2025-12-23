import React, { useEffect, useRef, useState, useContext } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function MoodTracker() {
  const { user, token, backend_url } = useContext(AppContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rAFRef = useRef(null);
  const navigate = useNavigate();

  const [status, setStatus] = useState("Initializing...");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expressions, setExpressions] = useState(null);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch mood history from backend on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/moodTracker/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const latest = (response.data.history || []).slice(0, 5);
          setHistory(latest);
          localStorage.setItem("moodHistory", JSON.stringify(latest));
        }
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };
    fetchHistory();
  }, [backend_url, token]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  // Check models exist in /public/models
  async function checkModelFiles() {
    try {
      const paths = [
        "/models/tiny_face_detector_model-weights_manifest.json",
        "/models/face_expression_model-weights_manifest.json",
      ];
      for (let p of paths) {
        const res = await fetch(p);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${p}`);
        await res.clone().json();
      }
      return true;
    } catch (err) {
      console.error("Model file check failed:", err);
      return false;
    }
  }

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setStatus("Checking model files...");
      const ok = await checkModelFiles();
      if (!ok) {
        setStatus("❌ Models missing in /public/models");
        return;
      }

      setStatus("Loading face-api models...");
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        if (!mounted) return;
        setModelsLoaded(true);
        setStatus("✅ Models loaded. Starting camera...");
        await startCamera();
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Error loading models — see console");
      }
    };

    init();
    return () => {
      mounted = false;
      stopEverything();
    };
  }, []);

  // Start camera and set canvas dimensions safely
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve(true);
      });

      await videoRef.current.play();

      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 400;
      }

      setStatus("📷 Camera started. Running detection...");
      detectLoop();
    } catch (err) {
      console.error(err);
      setStatus("❌ Camera error: " + (err.message || err));
    }
  };

  // Detect face and expressions continuously
  const detectLoop = async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) {
      rAFRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
      const result = await faceapi
        .detectSingleFace(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceExpressions();

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (result) {
        const dims = {
          width: videoRef.current.videoWidth || 640,
          height: videoRef.current.videoHeight || 400,
        };
        const resized = faceapi.resizeResults(result, dims);

        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

        const exp = result.expressions;
        const sorted = Object.entries(exp).sort((a, b) => b[1] - a[1]);
        const box = resized.detection.box;

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(box.x, box.y - 22, 160, 22);
        ctx.fillStyle = "#00ff88";
        ctx.fillText(`${sorted[0][0]} ${(sorted[0][1] * 100).toFixed(0)}%`, box.x + 6, box.y - 6);

        setExpressions(exp);
        setLastDetectionTime(Date.now());
      } else {
        setExpressions(null);
        setStatus(modelsLoaded ? "⚠️ No face detected – move into frame" : status);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Detection error — see console");
    } finally {
      rAFRef.current = requestAnimationFrame(detectLoop);
    }
  };

  const stopEverything = () => {
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Capture mood and push to history
  const handleCapture = async () => {
    if (!expressions) {
      toast.error("No expressions detected");
      return;
    }

    try {
      const topExpression = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      const response = await axios.post(
        backend_url + "/api/moodTracker/record",
        {
          expression: topExpression,
          scores: expressions,
          timestamp: new Date(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Mood captured!");
        setHistory(response.data.record.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } else {
        toast.error(response.data.message || "Error saving mood");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving mood");
    }
  };

  // Refresh mood history
  const handleRefresh = async () => {
    try {
      setHistory([]);
      toast.info("Refreshing history...");

      const deleteRes = await axios.delete(backend_url + "/api/moodTracker/clearhistory", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!deleteRes.data.success) {
        toast.error(deleteRes.data.message || "Error clearing backend history");
        return;
      }

      const response = await axios.get(backend_url + "/api/moodTracker/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const latest = (response.data.history || []).slice(0, 5);
        setHistory(latest);
        toast.success("History refreshed!");
      } else {
        toast.error(response.data.message || "Error fetching history");
      }
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("❌ Error refreshing history");
    }
  };

  // Navigate to Music Player with detected mood
  const handleSuggestedSongs = () => {
    const dominantMood = expressions
      ? Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0]
      : "neutral";
    navigate("/music-player", { state: { mood: dominantMood } });
  };

  return (
    <div className="min-h-screen p-2 bg-zinc-800 text-gray-200">
      <h2 className="text-2xl font-bold mb-3 text-lime-400 text-center">🧠 MoodTracker</h2>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-2 text-sm text-gray-400">
            Status: <span className="font-medium text-lime-400">{status}</span>
          </div>

          <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700 shadow-lg w-full max-w-lg">
            <video ref={videoRef} className="block w-full" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>

          <div className="mt-4 flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleCapture}
              className="bg-lime-500 px-4 py-1 rounded text-black font-semibold shadow hover:bg-lime-400"
            >
              Capture
            </button>
            <button
              onClick={handleRefresh}
              className="bg-yellow-400 px-4 py-1 rounded text-black font-semibold shadow hover:bg-yellow-300"
            >
              Delete History
            </button>
          </div>

          <div className="mt-2 text-lg text-center">
            <div className="font-semibold text-lime-400">
              Current Mood :{" "}
              <span className="capitalize">
                {expressions ? Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0] : "—"}
              </span>
            </div>
            <div>
              Last detection: {lastDetectionTime ? new Date(lastDetectionTime).toLocaleTimeString() : "—"}
            </div>
          </div>
        </div>

        {/* Right Section: History */}
        {history.length > 0 && (
          <div className="flex-1 mt-6 md:mt-0">
            <div className="w-full max-w-md mx-auto border-2 border-gray-600 rounded-2xl p-4 bg-black shadow-lg">
              <h3 className="font-bold mb-4 text-gray-200 text-center text-lg">Mood History (Last 5)</h3>

              <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto no-scrollbar">
                {history
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .slice(0, 5)
                  .map((h) => (
                    <div
                      key={h._id}
                      className="bg-zinc-800 p-4 rounded-xl shadow-md border border-gray-700 hover:border-lime-400 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`capitalize font-semibold text-lg ${
                            h.expression === "happy"
                              ? "text-green-400"
                              : h.expression === "neutral"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {h.expression}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(h.timestamp).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(h.scores).map(([k, v]) => {
                          let colorClass = "bg-green-500";
                          if (["sad", "angry", "fearful"].includes(k.toLowerCase())) colorClass = "bg-red-500";
                          else if (k.toLowerCase() === "neutral") colorClass = "bg-yellow-500";

                          return (
                            <div
                              key={k}
                              className={`${colorClass} text-black px-3 py-1 rounded-lg text-sm font-semibold text-center`}
                            >
                              {k}: {(v * 100).toFixed(1)}%
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>

              <hr className="border-2 w-full border-gray-300 mt-3 " />
              <button
                onClick={handleSuggestedSongs}
                className="bg-purple-500 active:scale-90 w-full px-4 py-2 rounded text-black font-semibold shadow hover:bg-purple-400 mt-4"
              >
                Suggested Songs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
