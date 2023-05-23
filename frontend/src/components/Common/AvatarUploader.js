import React, { useState } from 'react';
import {FaUpload, FaSync} from "react-icons/fa";
import "../../styles/common/AvatarUploader.css";
const AvatarUploader = ({handleAvatarUpload}) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [hover, setHover] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
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
                <label className={`upload-box ${hover ? 'hover' : ''}`}>
                    <input type="file" onChange={handleFileUpload} accept="image/*" />
                    <FaUpload className="upload-icon"/>
                    <span className="upload-text">Choose an avatar image</span>
                </label>
            ) : (
                <div className="uploaded-image-container">
                    <img src={uploadedImage} alt="Uploaded Avatar" className="uploaded-image" />
                    <div className="image-overlay">
                        <input type="file" onChange={handleFileUpload} accept="image/*" />
                        <FaSync className="reupload-icon"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarUploader;
