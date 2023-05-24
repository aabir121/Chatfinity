import React, { useEffect, useState } from 'react';
import { Button, CloseButton, Modal } from 'react-bootstrap';
import AvatarUploader from '../Common/AvatarUploader';
import { useDispatch, useSelector } from 'react-redux';
import { hideUserProfileModal } from '../../actions/userProfileModalActions';
import { UserDataService } from '../../services/UserDataService';
import { showToast } from '../../actions/toastActions';
import { hideLoader, showLoader } from '../../actions/loaderActions';
import '../../styles/Modal/UserProfileModal.css';

function UserProfileModal() {
    const dispatch = useDispatch();
    const { userName, firstName, lastName, avatar, dateOfBirth } = useSelector((state) => state.userList.currentUser);
    const showModal = useSelector((state) => state.userProfileModal.showUserProfileModal);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        avatar: '',
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        if (!!userName) {
            setFormData({
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth.split('T')[0],
                avatar: avatar,
            });
        }
    }, [userName, firstName, lastName, dateOfBirth, avatar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        clearError(name);
    };

    const handleFocusOut = async (e) => {
        const { name } = e.target;
        let errorMsg = '';

        if (name === 'firstName') {
            errorMsg = validateFirstName(formData.firstName);
        } else if (name === 'lastName') {
            errorMsg = validateLastName(formData.lastName);
        } else if (name === 'dateOfBirth') {
            errorMsg = validateDateOfBirth(formData.dateOfBirth);
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
            [name]: '',
        }));
    };

    const validateFirstName = (firstName) => {
        if (firstName.trim() === '') {
            return 'First Name is required';
        }
        return '';
    };

    const validateLastName = (lastName) => {
        if (lastName.trim() === '') {
            return 'Last Name is required';
        }
        return '';
    };

    const validateDateOfBirth = (dateOfBirth) => {
        if (!dateOfBirth) {
            return '';
        }

        const currentDate = new Date();
        const dobDate = new Date(dateOfBirth);
        const ageDifference = currentDate - dobDate;
        const ageInYears = ageDifference / (1000 * 60 * 60 * 24 * 365.25);

        if (ageInYears < 18) {
            return 'You must be at least 18 years old to sign up';
        }
        return '';
    };

    const handleAvatarUpload = (data) => {
        setFormData((prevState) => ({ ...prevState, avatar: data }));
    };

    const handleClose = () => {
        dispatch(hideUserProfileModal());
    };

    const handleSaveChanged = () => {
        const reqBody = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            avatar: formData.avatar,
        };

        dispatch(showLoader());
        UserDataService.updateUser(userName, reqBody)
            .then((data) => {
                if (data) {
                    dispatch(showToast('Success', 'User data updated'));
                    handleClose();
                } else {
                    dispatch(showToast('Error', 'User data cannot be updated'));
                }
            })
            .finally(() => {
                dispatch(hideLoader());
            });
    };

    const onEntered = () => {
        // Do something when the modal is entered
    };

    const renderError = (error) => {
        return error && <div className="error-message">{error}</div>;
    };

    return (
        <React.Fragment>
            <Modal show={showModal} backdrop="static" onEntered={onEntered}>
                <Modal.Header>
                    <h3>User Profile ({userName})</h3>
                    <CloseButton onClick={handleClose} />
                </Modal.Header>
                <Modal.Body>
                    <div className="input-container">
                        <div className="text-fields-container">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleFocusOut}
                                placeholder="First Name (50 char max)"
                            />
                            {renderError(errors.firstName)}
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleFocusOut}
                                placeholder="Last Name (50 char max)"
                            />
                            {renderError(errors.lastName)}
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onBlur={handleFocusOut}
                                onChange={handleChange}
                            />
                            {renderError(errors.dateOfBirth)}
                        </div>
                        <div className="avatar-container">
                            <AvatarUploader handleAvatarUpload={handleAvatarUpload} prevImageString={formData.avatar} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSaveChanged}>
                        Save Change
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

export default UserProfileModal;