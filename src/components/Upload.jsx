import "./init"

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import AWS from "aws-sdk";

// AWS S3 Configuration
const ACCESS_KEY = "ADBEKPODW5833K5S1JX6";  // Your Access Key
const SECRET_KEY = "tYqhz5zOkuPDzOL69yFAdAvL5Vjxx7GCiJeSuy1e";  // Your Secret Key
const REGION = "us-east-1";  // Your region, change if needed
const S3_BUCKET = "uigrade";  // Your S3 bucket name

// Configure AWS SDK
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint("https://s3.regru.cloud"),
  s3ForcePathStyle: true, // Ensures path-style URLs for reg.ru S3 service
});

// Function to set CORS configuration for S3 bucket programmatically
const setCORSConfiguration = () => {
  const corsParams = {
    Bucket: S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ["*"],  // Allow all origins (can be restricted to specific origins)
          AllowedMethods: ["GET", "POST", "PUT"],  // Allowed HTTP methods
          AllowedHeaders: ["*"],  // Allow all headers
        },
      ],
    },
  };

  s3.putBucketCors(corsParams, (err, data) => {
    if (err) {
      console.error("Error setting CORS configuration:", err);
    } else {
      console.log("CORS configuration set successfully:", data);
    }
  });
};

// Function to upload the file to S3
const uploadFileToS3 = (file) => {
  const fileName = `images/${Date.now()}_${file.name}`;  // Unique file name

  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: "public-read",  // Make the file publicly accessible
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);  // Return the URL of the uploaded file
      }
    });
  });
};

const S3UploadAndRetrieve = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Set CORS configuration when the app is loaded
    setCORSConfiguration();
  }, []);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const uploadedImageUrl = await uploadFileToS3(file);
      setImageUrl(uploadedImageUrl);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",  // Allow only image files
  });

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Upload Image to S3</h1>

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <p>Drag & Drop an image here, or click to select one</p>
        )}
      </div>

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Image:</h3>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ width: "100%", maxWidth: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default S3UploadAndRetrieve;
