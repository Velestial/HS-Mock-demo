import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import AccountPage from './AccountPage';

interface AuthWrapperProps {
    onBack: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack }) => {
    const { user } = useAuth();

    if (user) {
        return <AccountPage onBack={onBack} />;
    }

    return <LoginPage onLoginSuccess={() => { }} onBack={onBack} />;
};

export default AuthWrapper;
