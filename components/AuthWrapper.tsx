import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import AccountPage from './AccountPage';

interface AuthWrapperProps {
    onBack: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack }) => {
    const { user, sessionLoading } = useAuth();

    if (sessionLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) {
        return <AccountPage onBack={onBack} />;
    }

    return <LoginPage onLoginSuccess={() => { }} onBack={onBack} />;
};

export default AuthWrapper;
