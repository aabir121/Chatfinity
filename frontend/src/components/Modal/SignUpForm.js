import React, { useState } from 'react';
import '../../styles/Modal/SignUpForm.css'; // Import the CSS file for styling

const SignupForm = ({onBackToLoginClick, onSignUpSubmitClick}) => {
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        dob: "",
        password: "",
        confirmPassword: "",
        errors: {},
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const errors= formData.errors;
        if (errors.hasOwnProperty(name)) {
            errors[name] = "";
        }

        setFormData((prevState) =>
            ({ ...prevState, [name]: value, errors: errors }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form data
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
            // Submit form data
            onSignUpSubmitClick(formData);
        } else {
            setFormData((prevState) => ({ ...prevState, errors }));
        }
    };

    const { username, firstName, lastName, dob, password, confirmPassword, errors } = formData;

    return (
        <div className="signup-form-container">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="Username (15 char max)"
                />
                <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    placeholder="First Name (50 char max)"
                />
                <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    placeholder="Last Name (50 char max)"
                />
                {errors.dob && <div className="error">{errors.dob}</div>}
                <input type="date" name="dob" value={dob} onChange={handleChange} />
                {errors.password && <div className="error">{errors.password}</div>}
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
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