import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import {Camera} from "react-camera-pro";

const CameraComponent = ( {width = '18%', height = 'auto', onDetectedObject} ) => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [detectedObject, setDetectedObject] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = () => {
    setLoading(true);
    fetch('/api/detect', {
      method: 'POST',
      body: JSON.stringify({ imageB64: image })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setDetectedObject("Detected object: "+data);
      onDetectedObject(data);
    })
    .catch(error => {
      console.error('Error detecting object:', error);
      setDetectedObject('Error: Unable to detect object');
      onDetectedObject(null); 
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <>
      {isCameraOn && (
        <div style={{ width, height, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Camera 
            ref={camera} 
            facingMode='environment' 
            aspectRatio={16 / 9}
          />
          <Button variant="contained" onClick={() => {
            setImage(camera.current.takePhoto());
            setIsCameraOn(false);
          }}>Take photo</Button>
        </div>
      )}
      {image && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
          <img src={image} alt='Taken photo' style={{ width: '50%', height: 'auto' }} />
          <div style={{alignItems: 'center'}}>
            <Button variant="contained" onClick={() => {
              setImage(null); 
              setIsCameraOn(true); 
              setDetectedObject(null);
            }}>Retake photo</Button>
            <Button variant="contained" onClick={handleDetect} disabled={loading}>Detect</Button>
          </div>
          {detectedObject && <p style={{color: 'blue'}}>{detectedObject}</p>}
          {loading && <p style={{color: 'yellow'}}>Loading...</p>}
        </div>
      )}
    </>
  );
}

export {CameraComponent};