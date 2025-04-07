import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import React from 'react'

import CollegePage from './pages/College'
import CommutePage from './pages/Commute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StateSearch from './pages/StateSearch'
import { useAuth } from './context/AuthContext';

export interface User {
    id: number
}

export interface WithUserProps {
    user: User | null
}

function App() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const clickLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <div className="App" style={{ margin: '1rem' }}>
            <header className="App-header">
                <h1>Focus Frontend Interview Exercise</h1>
            </header>
            <nav
                style={{
                    borderBottom: 'solid 1px',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                }}
            >
                <Link to="/">Home</Link>|{' '}
                <>
                    <Link to="/states">States Search Example</Link>|{' '}
                    <Link to="/college">College Concentrations</Link>|{' '}
                    <Link to="/commutes">Commutes</Link>|{' '}
                    <Link to="/login">Login</Link>|{' '}
                    <Link to="/signup">Signup</Link>| <a href="#" onClick={clickLogout}>Logout</a>
                    {user && <span>  Logged in as {user}</span>}
                </>
            </nav>
            <Routes>
                <Route path="*" element={!isAuthenticated && <Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={isAuthenticated ? <Home /> : <Login />} />
                <Route path="/signup" element={isAuthenticated ? <Home /> : <Signup />} />

                <Route path="/states" element={isAuthenticated ? <StateSearch /> : <Login />} />
                <Route path="commutes" element={isAuthenticated ? <CommutePage /> : <Login />} />
                <Route path="college" element={isAuthenticated ? <CollegePage /> : <Login />} />

            </Routes>
        </div>
    )
}

export default App
