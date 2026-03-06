import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, fetchCustomerOrders, updateCustomer } from '../services/api';

// Define the User interface based on WooCommerce Customer Schema
export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    billing: {
        first_name: string;
        last_name: string;
        company: string;
        address_1: string;
        address_2: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
        email: string;
        phone: string;
    };
    shipping: {
        first_name: string;
        last_name: string;
        company: string;
        address_1: string;
        address_2: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    orders?: any[]; // Cached orders
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('heyskipper_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user:", e);
                localStorage.removeItem('heyskipper_user');
            }
        }
    }, []);

    // Refresh orders when user is loaded
    useEffect(() => {
        if (user?.id) {
            fetchCustomerOrders(user.id).then(orders => {
                setUser(prev => prev ? { ...prev, orders } : null);
            });
        }
    }, [user?.id]); // Only run if ID changes

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Note: Password is ignored for this "Magic Link" / "Email Match" style demo login
            // Real auth entails WC JWT or similar.
            const customer = await loginUser(email);

            // Format customer to match our User interface if needed, or just use raw WC object
            // WC object fits reasonably well, but we need to ensure orders array exists
            const newUser = {
                ...customer,
                orders: [],
                billing: customer.billing || {},
                shipping: customer.shipping || {}
            };

            setUser(newUser);
            localStorage.setItem('heyskipper_user', JSON.stringify(newUser));
            return true;
        } catch (error) {
            console.error("Login Failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('heyskipper_user');
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // For now, registration maps to Login or UI error saying "Use Checkout to Register"
        // Implementing full registration requires POST /customers which we can do, 
        // but let's encourage using existing accounts first.
        return login(email, password);
    };

    const updateUser = async (data: Partial<User>) => {
        if (user) {
            try {
                // Determine what to send to WC (usually just specific fields)
                // If detailed billing/shipping update is needed, 'data' should look like WC expected payload
                const updatedCustomer = await updateCustomer(user.id, data);
                const mergedUser = { ...user, ...updatedCustomer };
                setUser(mergedUser);
                localStorage.setItem('heyskipper_user', JSON.stringify(mergedUser));
            } catch (err) {
                console.error("Update failed:", err);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
