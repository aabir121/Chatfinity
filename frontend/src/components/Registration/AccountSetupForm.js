import React, {useEffect, useRef, useState} from "react";
import {PasswordInput} from "../Common/PasswordInput";
import {Button} from "react-bootstrap";
import {UserDataService} from "../../services/UserDataService";

function AccountSetupForm({userData, handleNext}) {
    const [formData, setFormData] = useState({
        userName: userData.userName,
        password: userData.password,
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        userName: "",
        password: "",
        confirmPassword: "",
    });

    const usernameRef = useRef(null);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        clearError(name);
    };

    const handleFocusOut = async (e) => {
        const {name} = e.target;
        let errorMsg = "";

        if (name === "userName") {
            errorMsg = await validateUserName();
        } else if (name === "password") {
            errorMsg = validatePassword();
        } else if (name === "confirmPassword") {
            errorMsg = validateConfirmPassword();
        }

        if (errorMsg) {
            e.stopPropagation();
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg,
        }));
    };

    const clearError = (name) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateUserName = async () => {
        try {
            const data = await UserDataService.validateUserName(userName.trim());

            if (!data) {
                usernameRef.current.focus();
                return "Username already exists";
            } else {
                return "";
            }
        } catch (error) {
            console.error("Error occurred during username validation:", error);
        }

        return "";
    };

    const validatePassword = () => {
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, " +
                "one number, and one symbol";
        }

        return "";
    };

    const validateConfirmPassword = () => {
        if (confirmPassword !== password) {
            return "Passwords do not match";
        }

        return "";
    };

    const handleSubmit = () => {
        validatePassword();
        validateConfirmPassword();
        const isValid = !errors.password && !errors.confirmPassword;
        if (isValid) {
            handleNext(formData);
        }
    };

    const {userName, password, confirmPassword} = formData;

    const isNextDisabled =
        userName.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === "" ||
        errors.userName ||
        errors.password ||
        errors.confirmPassword;

    return (
        <>
            <div className="input-container">
                <input
                    type="text"
                    name="userName"
                    value={userName}
                    onChange={handleChange}
                    placeholder="Username (15 char max)"
                    ref={usernameRef}
                    onBlur={handleFocusOut}
                />
                {errors.userName && <div className="error-message">{errors.userName}</div>}

                <div className="password-container">
                    <PasswordInput
                        onBlur={handleFocusOut}
                        onChange={handleChange}
                        passValue={password}
                        error={password}
                    />
                </div>
                <div className="password-container">
                    <PasswordInput
                        onBlur={handleFocusOut}
                        onChange={handleChange}
                        passValue={confirmPassword}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        error={confirmPassword}
                    />
                </div>

                {errors.password && <div className="error-message">{errors.password}</div>}
                {errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword}</div>
                )}
            </div>
            <div className="reg-button-container">
                <Button disabled size="sm" variant="secondary">
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isNextDisabled}
                >
                    Next
                </Button>
            </div>
        </>
    );
}

export default AccountSetupForm;