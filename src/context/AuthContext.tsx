import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    user: string | null;
    logIn: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signUp: (username: string, password: string, confirmPassword: string) => Promise<void>;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("In AuthProvider, useAuth must be used");
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:4001/session').then(response => {
            if (response.data.loggedIn) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
    }, []);

    const logIn = async (username: string, password: string) => {
        try {
            await axios.post('http://localhost:4001/login', { username, password });
            setIsAuthenticated(true);
            setUser(username);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 403) {
                    throw new Error('Username and/or Password incorrect');
                }
                throw new Error(error.message || 'An unknown error occurred');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const signUp = async (username: string, password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        try {
            await axios.post('http://localhost:4001/signup', { username, password });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400) {
                    throw new Error('Username already exists');
                }
                throw new Error(error.message || 'An unknown error occurred');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const logout = async () => {
        await axios.get('http://localhost:4001/logout');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, logIn, logout, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};
