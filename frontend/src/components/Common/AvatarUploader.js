import React, { useEffect, useState } from 'react';
import { FaUpload, FaSync } from 'react-icons/fa';
import '../../styles/common/AvatarUploader.css';

const UploadBox = ({ handleFileUpload, hover }) => (
    <label className={`upload-box ${hover ? 'hover' : ''}`}>
        <input type="file" onChange={handleFileUpload} accept="image/*" />
        <FaUpload className="upload-icon" />
        <span className="upload-text">Choose an avatar image</span>
    </label>
);

const UploadedImage = ({ imageUrl, handleFileUpload }) => (
    <div className="uploaded-image-container">
        <img src={imageUrl} alt="Uploaded Avatar" className="uploaded-image" />
        <div className="image-overlay">
            <input type="file" onChange={handleFileUpload} accept="image/*" />
            <FaSync className="reupload-icon" />
        </div>
    </div>
);

const AvatarUploader = ({ handleAvatarUpload, prevImageString }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [hover] = useState(false);

    useEffect(() => {
        if (prevImageString) {
            const blob = base64ToBlob("data:image/jpeg;base64," + prevImageString);
            const imageUrl = URL.createObjectURL(blob);
            setUploadedImage(imageUrl);
        }

        return () => {
            if (uploadedImage) {
                URL.revokeObjectURL(uploadedImage);
            }
        };
    }, [prevImageString, uploadedImage]);

    const base64ToBlob = (base64) => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                setUploadedImage(reader.result);
                handleAvatarUpload?.(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="avatar-uploader">
            {!uploadedImage ? (
                <UploadBox handleFileUpload={handleFileUpload} hover={hover} />
            ) : (
                <UploadedImage imageUrl={uploadedImage} handleFileUpload={handleFileUpload} />
            )}
        </div>
    );
};

export default AvatarUploader;
