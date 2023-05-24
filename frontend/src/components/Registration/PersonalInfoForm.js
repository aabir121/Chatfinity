import React, {useState} from "react";
import {Button} from "react-bootstrap";

function PersonalInfoForm({userData, handleNext, handlePrev }) {
    const [formData, setFormData] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({...prevFormData, [name]: value}));
        clearError(name);
    };

    const handleFocusOut = async (e) => {
        const {name} = e.target;
        let errorMsg = "";

        if (name === "firstName") {
            errorMsg = validateFirstName();
        } else if (name === "lastName") {
            errorMsg = validateLastName();
        } else if (name === "dateOfBirth") {
            errorMsg = validateDateOfBirth();
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

    const validateFirstName = () => {
        if (firstName.trim() === "") {
            return "First Name is required";
        }

        return "";
    };

    const validateLastName = () => {
        if (lastName.trim() === "") {
            return "Last Name is required";
        }

        return "";
    };

    const validateDateOfBirth = () => {
        if (!dateOfBirth) {
            return "";
        }

        const currentDate = new Date();
        const dobDate = new Date(dateOfBirth);
        const ageDifference = currentDate - dobDate;
        const ageInYears = ageDifference / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears < 18) {
            return "You must be at least 18 years old to sign up";
        }

        return "";
    };

    const handleSubmit = () => {
        validateFirstName();
        validateLastName();
        validateDateOfBirth();
        const isValid = !errors.firstName && !errors.lastName && !errors.dateOfBirth;
        if (isValid) {
            handleNext(formData);
        }
    };

    const { firstName, lastName, dateOfBirth } = formData;

    const isNextDisabled =
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        dateOfBirth.trim() === "" ||
        errors.firstName ||
        errors.lastName ||
        errors.dateOfBirth;

    return (
        <>
            <div className="input-container">
                <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    onBlur={handleFocusOut}
                    placeholder="First Name (50 char max)"
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    onBlur={handleFocusOut}
                    placeholder="Last Name (50 char max)"
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                <input
                    type="date"
                    name="dateOfBirth"
                    value={dateOfBirth}
                    onBlur={handleFocusOut}
                    onChange={handleChange}
                />
                {errors.dateOfBirth && (
                    <div className="error-message">{errors.dateOfBirth}</div>
                )}
            </div>
            <div className="reg-button-container">
                <Button size="sm" variant="secondary" onClick={handlePrev}>
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

export default PersonalInfoForm;