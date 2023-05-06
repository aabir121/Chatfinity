import React, {useState} from "react";
import "../../styles/Modal/LoginForm.css";
import {PasswordInput} from "../Common/PasswordInput";
import {UserDataService} from "../../services/UserDataService";

const LogInForm = ({errorText, onLoginSuccess, onSignUpClick}) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        errorText: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value, errorText: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userBody = {
            Username: formData.username,
            Password: formData.password
        }

        UserDataService.loginUser(userBody).then((data) => {
            onLoginSuccess?.(data);
        }).catch((error) => {
            console.error(error);
            setFormData({...formData, errorText: 'Unable to login. Please check your username and/or password and try again.'});
        });
    }

    return(
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input type="text" id="username" onChange={handleInputChange} value={formData.username} placeholder="Username"/>
                <PasswordInput onChange={handleInputChange} passValue={formData.password}></PasswordInput>
                <span className="error">{formData.errorText}</span>
                <button type="submit">Login</button>
                <div className="signup-link">
                    <p>Don't have an account?</p>
                    <span onClick={onSignUpClick}>Sign up</span>
                </div>
            </form>
        </div>
    );
}

export default LogInForm;