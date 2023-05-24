import React, {useState} from "react";
import AvatarUploader from "../Common/AvatarUploader";
import {Button} from "react-bootstrap";

function AvatarSetupForm({userData, handleNext, handlePrev }) {
    const [formData, setFormData] = useState({
        avatar: userData.avatar,
    });

    const handleAvatarChange = (data) => {
        setFormData({ avatar: data });
    };

    return (
        <>
            <div className="input-container">
                <AvatarUploader handleAvatarUpload={handleAvatarChange} />
            </div>
            <div className="reg-button-container">
                <Button size="sm" variant="secondary" onClick={handlePrev}>
                    Previous
                </Button>
                <Button size="sm" variant="success" onClick={() => handleNext(formData)}>
                    Complete Registration
                </Button>
            </div>
        </>
    );
}

export default AvatarSetupForm;