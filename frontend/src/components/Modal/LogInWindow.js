import React, {useRef, useState} from "react";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import {Modal} from "react-bootstrap";
import {showToast} from "../../actions/toastActions";
import {useDispatch} from "react-redux";
import RegistrationForm from "../Registration/RegistrationForm";

const LogInWindow = ({show, handleClose}) => {
    const [showSignUp, setShowSignup] = useState(false);
    const dispatch = useDispatch();
    const modalContainerRef = useRef(null);

    const onSignUpClick = () => {
        setShowSignup(true);
    };

    const onSignUpSubmitClick = () => {
        setShowSignup(false);
        dispatch(showToast('Success', 'Account created. You can now login.'));
    };

    const onLoginSuccess = (loginData) => {
        handleClose?.(loginData);
    };

    const onBackToLoginClick = () => {
        setShowSignup(false);
    };

    return (
        <div ref={modalContainerRef}>
            <Modal container={modalContainerRef.current} backdrop="static"
                   show={show} onHide={handleClose}>
                {
                    showSignUp ? (
                        <RegistrationForm onBackToLoginClick={onBackToLoginClick} onSignUpSubmitClick={onSignUpSubmitClick}/>
                    ) : (
                        <LogInForm onLoginSuccess={onLoginSuccess} onSignUpClick={onSignUpClick}></LogInForm>
                    )
                }
            </Modal>
        </div>
    );
};

export default LogInWindow;
