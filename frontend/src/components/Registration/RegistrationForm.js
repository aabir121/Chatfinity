import RegProgressIndicator from "../Common/RegProgressIndicator";
import React, {useState} from "react";
import "../../styles/Registration/RegistrationForm.css";
import {hideLoader, showLoader} from "../../actions/loaderActions";
import {UserDataService} from "../../services/UserDataService";
import {useDispatch} from "react-redux";
import AccountSetupForm from "./AccountSetupForm";
import AvatarSetupForm from "./AvatarSetupForm";
import PersonalInfoForm from "./PersonalInfoForm";

function RegistrationForm({onBackToLoginClick, onSignUpSubmitClick}) {
    const dispatch = useDispatch();
    const [currStep, setCurrStep] = useState(1);

    const [userData, setUserData] = useState({
        userName: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        password: "",
        avatar: ""
    })

    const handleNext = (updatedData) => {
        setCurrStep(currStep + 1);
        setUserData(prevUserData => ({
            ...prevUserData,
            ...updatedData
        }));
    };

    const handlePrev = () => {
        setCurrStep(currStep - 1);
    };

    const handleSubmit = (updatedData) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            ...updatedData
        }));

        createAccount();
    }

    const createAccount = () => {
        const requestBody = {
            userName: userData.userName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
            password: userData.password,
            avatar: userData.avatar
        };

        dispatch(showLoader());

        UserDataService.createNewUser(requestBody).then((data) => {
            onSignUpSubmitClick(data);
            dispatch(hideLoader());
        }).catch((error) => {
            console.error(error);
            dispatch(hideLoader());
        });
    };


    const handleStepRendering = () => {
        if (currStep === 1) {
            return <AccountSetupForm userData={userData} handleNext={handleNext}/>
        } else if (currStep === 2) {
            return <PersonalInfoForm userData={userData} handlePrev={handlePrev} handleNext={handleNext}/>
        } else {
            return <AvatarSetupForm userData={userData} handlePrev={handlePrev} handleNext={handleSubmit}/>;
        }
    }

    return (
        <div className="reg-form-container">
            <RegProgressIndicator currentStep={currStep}/>
            {handleStepRendering()}
            <div className="login-link">
                <p>Already have an account? </p>
                <span onClick={onBackToLoginClick}>Login</span>
            </div>
        </div>
    );
}

export default RegistrationForm;