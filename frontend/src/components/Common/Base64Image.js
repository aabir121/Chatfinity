import React from 'react';
import {FaUser} from "react-icons/fa";

const Base64Image = ({base64String, altText}) => {
    const imageStyle = {
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%'
    };

    return (
        <>
            {base64String ? <img src={`data:image/jpeg;base64,${base64String}`} alt={altText || "N/A"} style={imageStyle}/>
                : <FaUser/>}
        </>
    );
}
export default Base64Image;