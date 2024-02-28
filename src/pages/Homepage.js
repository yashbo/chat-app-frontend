import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div>
            <h1>Welcome to Our Website</h1>
            <p>Please choose an option:</p>
            <button onClick={handleLoginClick}>Login</button>
            <button onClick={handleRegisterClick}>Register</button>
        </div>
    );
}
