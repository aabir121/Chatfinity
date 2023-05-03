import React, {useState} from "react";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import {Spinner} from "../Common/Spinner";
import {UserDataService} from "../../services/UserDataService";

const LogInWindow = ({isOpen, onLoginSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [showSignUp, setShowSignup] = useState(false);

    if (!isOpen) return null;

    const onSignUpClick = () => {
        setShowSignup(true);
    };

    const onSignUpSubmitClick = (formData) => {
        setLoading(true);
        const requestBody = {
            UserName: formData.username,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            DateOfBirth: formData.dob,
            Password: formData.password,
        };

        UserDataService.createNewUser(requestBody).then((data) => {
            console.log(data);
            setLoading(false);
            setShowSignup(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    };

    const onLoginSubmitClick = (formData) => {
        const userBody = {
            Username: formData.username,
            Password: formData.password
        }

        UserDataService.loginUser(userBody).then((data)=>{
            console.log(data);
            onLoginSuccess?.(data);
        }).catch((error)=>{
            console.error(error);
        });
    };

    const onBackToLoginClick = () => {
        setShowSignup(false);
    };

    return (
        <div className="modal-container">
            {loading && <Spinner/>}
            <div className="modal-content">
                {
                    showSignUp ? (
                        <SignUpForm onBackToLoginClick={onBackToLoginClick}
                                    onSignUpSubmitClick={onSignUpSubmitClick}></SignUpForm>
                    ) : (
                        <LogInForm onLoginClick={onLoginSubmitClick} onSignUpClick={onSignUpClick}></LogInForm>
                    )
                }
            </div>
        </div>
    );
};

export default LogInWindow;
