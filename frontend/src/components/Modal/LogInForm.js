import React, {useState} from "react";
import "../../styles/Modal/LoginForm.css";

const LogInForm = ({onLoginClick, onSignUpClick}) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLoginClick?.(formData);
        console.log(formData.username, formData.password);
    }

    return(
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input type="text" id="username" onChange={handleInputChange} value={formData.username} placeholder="Username"/>
                <input type="password" id="password" onChange={handleInputChange} value={formData.password} placeholder="Password"/>
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