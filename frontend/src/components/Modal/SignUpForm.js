import React, { useState } from 'react';
import '../../styles/Modal/SignUpForm.css';
import { PasswordInput } from "../Common/PasswordInput";
import { UserDataService } from "../../services/UserDataService";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../actions/loaderActions";
import AvatarUploader from "../Common/AvatarUploader";
import RegProgressIndicator from "../Common/RegProgressIndicator";

const SignupForm = ({ onBackToLoginClick, onSignUpSubmitClick }) => {
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        dob: "",
        password: "",
        confirmPassword: "",
        errors: {},
    });
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errors = formData.errors;
        if (errors.hasOwnProperty(name)) {
            errors[name] = "";
        }

        setFormData((prevState) => ({ ...prevState, [name]: value, errors: errors }));
    };

    const handleAvatarChange = (data) => {
        setAvatar(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        const { dob, password, confirmPassword } = formData;
        const currentDate = new Date();
        const dobDate = new Date(dob);
        const ageDifference = currentDate - dobDate;
        const ageInYears = ageDifference / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears < 18) {
            errors.dob = "You must be at least 18 years old to sign up";
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            errors.password =
                "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, one number, and one symbol";
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Confirm password does not match";
        }

        if (Object.keys(errors).length === 0) {
            createAccount();
        } else {
            setFormData((prevState) => ({ ...prevState, errors }));
        }
    };

    const createAccount = () => {
        const requestBody = {
            userName: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dob,
            password: formData.password,
            avatar: avatar
        };

        dispatch(showLoader());

        UserDataService.createNewUser(requestBody).then((data) => {
            onSignUpSubmitClick(data);
            dispatch(hideLoader());
        }).catch((error) => {
            console.error(error);
            dispatch(hideLoader());
            const errorObj = {
                submit: error.description
            };
            setFormData({ ...formData, errors: errorObj });
        });
    };

    const { username, firstName, lastName, dob, password, confirmPassword, errors } = formData;

    return (
        <div className="signup-form-container">
            <h2>Sign Up</h2>
            <RegProgressIndicator currentStep={1}/>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="avatar-container">
                    <AvatarUploader handleAvatarUpload={handleAvatarChange}/>
                </div>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="Username (15 char max)"
                />
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleChange}
                            placeholder="First Name (50 char max)"
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleChange}
                            placeholder="Last Name (50 char max)"
                        />
                    </div>
                </div>
                {errors.dob && <div className="error">{errors.dob}</div>}
                <input type="date" name="dob" value={dob} onChange={handleChange} />
                <div className="row">
                    <div className="col-md-6">
                        {errors.password && <div className="error">{errors.password}</div>}
                        <div className="password-container">
                            <PasswordInput onChange={handleChange} passValue={password}></PasswordInput>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                        <div className="password-container">
                            <PasswordInput onChange={handleChange} passValue={confirmPassword}
                                           placeholder={"Confirm Password"} name={"confirmPassword"}></PasswordInput>
                        </div>
                    </div>
                </div>
                {errors.submit && <div className="error">{errors.submit}</div>}
                <button type="submit">Sign Up</button>
            </form>
            <div className="login-link">
                <p>Already have an account? </p>
                <span onClick={onBackToLoginClick}>Login</span>
            </div>
        </div>
    );
};

export default SignupForm;
