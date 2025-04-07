import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();
    const { logIn } = useAuth();


    const triggerLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await logIn(username, userPassword);
            navigate('/');
        } catch (e) {
            if (e instanceof Error) {
                setErrorMessage(`Error: ${e.message}`);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        }
    }
    return (<div className="container">
        <h1>Login</h1>
        <br />
        <form onSubmit={triggerLogin}>
            <label htmlFor="username">Username:</label>
            <input
                required
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMessage('') }}
            />
            <label htmlFor="userPassword">Password:</label>
            <input
                required
                type="password"
                name="userPassword"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => { setUserPassword(e.target.value); setErrorMessage('') }}
            />
            {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
            <button className="btn" type="submit">Sign In</button>
        </form>

    </div>)
}

export default Login
