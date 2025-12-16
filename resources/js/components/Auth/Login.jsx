import React from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: password
            });
            
            console.log('Login Response:', response.data);
            
            if (response.data.success && response.data.data) {
                const { token, user } = response.data.data;
                onLogin(token, user);
                navigate('/staff/dashboard');
            }else {
                // Handle case where response structure is different
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement(
        'div',
        { className: 'login-container' },
        React.createElement(
            'div',
            { className: 'login-card' },
            React.createElement(
                'div',
                { className: 'login-header' },
                React.createElement('h1', { className: 'login-title' }, 'TPHRC Admin'),
                React.createElement('p', { className: 'login-subtitle' }, 'Restaurant Management System')
            ),
            error && React.createElement('div', { className: 'login-error' }, error),
            React.createElement(
                'form',
                { onSubmit: handleSubmit, className: 'login-form' },
                React.createElement(
                    'div',
                    { className: 'login-form-group' },
                    React.createElement('label', { className: 'login-label' }, 'Email'),
                    React.createElement('input', {
                        type: 'email',
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        className: 'login-input',
                        required: true
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'login-form-group-password' },
                    React.createElement('label', { className: 'login-label' }, 'Password'),
                    React.createElement('input', {
                        type: 'password',
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        className: 'login-input',
                        required: true
                    })
                ),
                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        disabled: loading,
                        className: 'login-button'
                    },
                    loading ? 'Logging in...' : 'Login'
                )
            ),
            React.createElement(
                'div',
                { className: 'login-demo-credentials' },
                React.createElement('p', null, 'Demo Credentials:'),
                React.createElement('p', null, 'Email: test@example.com'),
                React.createElement('p', null, 'Password: password123')
            )
        )
    );
}
