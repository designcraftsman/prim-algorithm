import React, { useState, useRef, useEffect } from "react";
import { BiAnalyse } from "react-icons/bi";
import DOMPurify from "dompurify";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [edgesDetected, setEdgesDetectedImage] = useState(null);
  const [edgesCropped, setEdgesCropped] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const base64Url = await fileToBase64(file);
      setImageUrl(base64Url);
      displayImage(file);
    }
  };

  const displayImage = (source) => {
    const uploadArea = document.querySelector(".upload-zone");
    uploadArea.textContent = "";

    if (source instanceof File) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(source);
      uploadArea.appendChild(img);
    } else if (typeof source === "string") {
      const img = document.createElement("img");
      img.src = source;
      uploadArea.appendChild(img);
    }
  };

  const checkUrlStatus = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        setImageUrl(url);
        displayImage(url);
        urlInputRef.current.style.borderColor = "green";
      }
    } catch (error) {
      urlInputRef.current.style.borderColor = "red";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const clipboardItems = event.clipboardData.items;
      for (let item of clipboardItems) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          handleFileUpload(file);
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const handleUpload = async () => {
    if (!imageUrl) {
      console.error("No image URL available");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://detect.roboflow.com/infer/workflows/diagrammdataset/custom-workflow-4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: "Cc8BXeBef2SVXBvXus7V",
            inputs: {
              image: { type: "url", value: imageUrl },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result);

      // Handle Detected Edges
      if (result.outputs[0].Detected_Edges && result.outputs[0].Detected_Edges.value) {
        const base64Image = `data:image/jpeg;base64,${result.outputs[0].Detected_Edges.value}`;
        setEdgesDetectedImage(base64Image);
      }

      // Handle Edges_Cropped Array
      if (result.outputs[0].Edges_Cropped && Array.isArray(result.outputs[0].Edges_Cropped)) {
        const croppedImages = result.outputs[0].Edges_Cropped.map(
          (item) => `data:image/jpeg;base64,${item.value}`
        );
        setEdgesCropped(croppedImages);
      }

      setResults(result);
      setTimeout(() => setShowResults(true), 100);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <div className={`upload-container p-3 ${showResults ? "results-shown" : ""}`}>
        <div
          className={`upload-zone ${isDragOver ? "dragover" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFileUpload(e.dataTransfer.files[0]);
          }}
        >
          <p>Choisissez un fichier ou glissez une image ici</p>
          <span>Taille maximale: 100 MB.</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </div>
        <div className="separator">&mdash; ou &mdash;</div>
        <div className="input-wrap">
          <input
            ref={urlInputRef}
            type="text"
            className="paste-url"
            placeholder="Collez l'URL/Image ici"
            onChange={(e) => {
              clearTimeout(typingTimerRef.current);
              setLoading(true);
              typingTimerRef.current = setTimeout(() => {
                checkUrlStatus(e.target.value);
              }, 2000);
            }}
          />
          {loading && (
            <div className="load">
              <div className="loader-item loader-1"></div>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="text-white btn btn-reverse hover-border-reverse"
          >
            <span>
              <BiAnalyse /> {loading ? "Traitement en cours..." : "Traiter l'image"}
            </span>
          </button>
        </div>
      </div>

      {showResults && (
        <div className="results-container show">
          <h2 className="display-6">
            <u>Résultats:</u>
          </h2>
          {edgesDetected && (
            <div>
              <h4>Arêtes détectés:</h4>
              <img
                src={edgesDetected}
                alt="Detected Edges"
                className="col-8 "
              />
            </div>
          )}
          {edgesCropped.length > 0 && (
            <div className="my-3">
              <h4>Arêtes coupés:</h4>
              <div className="cropped-gallery">
                {edgesCropped.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Cropped Edge ${index + 1}`}
                    className="col-2 mx-3"
                  />
                ))}
              </div>
            </div>
          )}
          {results.outputs[0].Cropped_Images_Text.length > 0 && (
            <div className="my-3">
              <h4>Arêtes:</h4>
              <ul className="cropped-gallery">
                {results.outputs[0].Cropped_Images_Text.map(( edge) => (
                  <li className="fs-6">
                    {edge}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
