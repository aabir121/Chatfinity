import {FaEye, FaEyeSlash} from "react-icons/fa";
import React, {useState} from "react";
import '../../styles/common/PasswordInput.css';

export const PasswordInput = ({onChange, passValue, placeholder, name}) => {
    const [showPass, setShowPass] = useState(false);
    return (
        <div className="password-container">
            <input type={showPass ? "text" : "password"} id={name || "password"} onChange={onChange} value={passValue}
                   placeholder={placeholder || "Password"} name={name || "password"}/>
            <span onClick={() => setShowPass(!showPass)}>
                        {showPass ? <FaEye/> : <FaEyeSlash/>}
            </span>
        </div>
    );
}