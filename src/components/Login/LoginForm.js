import React from "react";

import { FaLock, FaUser } from "react-icons/fa";

import './LoginForm.css'

const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action="">
                <h1>Login</h1>

                <div className="input-box">
                    <input type="text" placeholder="Username" required />
                    <FaUser className="icon"/>
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" required />
                    <FaLock className="icon"/>
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox"/>remenber me</label>
                    <a href="ss">forgot password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link">
                    <p>Don't have an account?<a href="ss">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;