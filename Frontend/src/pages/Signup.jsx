
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import { MyContext } from '../MyContext';

function Signup() {
    const navigate = useNavigate();
    const { setAuthenticated } = useContext(MyContext);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'http://localhost:3000/api/users/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully!");

                console.log(data);

                setAuthenticated(true);
                navigate('/chat');
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Create Account</h1>
                <p>Sign up to get started with AsGpt</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Sign Up
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
