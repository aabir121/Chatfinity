import React, {useState} from "react";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import {Spinner} from "../Common/Spinner";
import {Modal} from "react-bootstrap";
import {showToast} from "../../actions/toastActions";
import {useDispatch} from "react-redux";

const LogInWindow = ({show, handleClose}) => {
    const [loading, setLoading] = useState(false);
    const [showSignUp, setShowSignup] = useState(false);
    const dispatch = useDispatch();

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
        <Modal show={show} onHide={handleClose}>
            {loading && <Spinner/>}
            {
                showSignUp ? (
                    <SignUpForm onBackToLoginClick={onBackToLoginClick}
                                onSignUpSubmitClick={onSignUpSubmitClick}></SignUpForm>
                ) : (
                    <LogInForm onLoginSuccess={onLoginSuccess} onSignUpClick={onSignUpClick}></LogInForm>
                )
            }
        </Modal>
    );
};

export default LogInWindow;
