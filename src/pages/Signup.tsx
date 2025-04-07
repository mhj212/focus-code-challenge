import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [confirmUserPassword, setConfirmUserPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const triggerSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userPassword !== confirmUserPassword) {
            setErrorMessage('Passwords do not match, please fix to continue');
            return;
        }

        try {
            await signUp(username, userPassword, confirmUserPassword);
            navigate('/login');
        } catch (e) {
            // Error is being handled by the signUp function in AuthContext
            if (e instanceof Error) {
                setErrorMessage(e.message);
            } else {
                setErrorMessage('An unknown error occurred.');
            }

        }

    }

    return (
        <div className="container">
            <h1>Sign up</h1>
            <br />
            <form onSubmit={triggerSignup}>
                <label htmlFor="username">Username:</label>
                <input
                    required
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setErrorMessage(''); }}
                />
                <label htmlFor="userPassword">Password:</label>
                <input
                    required
                    type="password"
                    name="userPassword"
                    placeholder="Password"
                    value={userPassword}
                    onChange={(e) => { setUserPassword(e.target.value); setErrorMessage(''); }}
                />
                <label htmlFor="confirmUserPassword">Confirm Password:</label>
                <input
                    required
                    name="confirmUserPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmUserPassword}
                    onChange={(e) => { setConfirmUserPassword(e.target.value); setErrorMessage(''); }}
                />
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                <button className="btn" type="submit">Sign Up</button>
            </form>

        </div>
    )
}
export default Signup
