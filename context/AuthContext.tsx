import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User interface
export interface User {
    name: string;
    email: string;
    addresses: {
        billing: Address;
        shipping: Address;
    };
    orders: Order[];
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    total: number;
    items: { name: string; quantity: number }[];
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Mock Data
const MOCK_USER: User = {
    name: 'Skipper Fan',
    email: 'user@example.com',
    addresses: {
        billing: {
            street: '123 Ocean Ave',
            city: 'Miami',
            state: 'FL',
            zip: '33101'
        },
        shipping: {
            street: '123 Ocean Ave',
            city: 'Miami',
            state: 'FL',
            zip: '33101'
        }
    },
    orders: [
        {
            id: '#ORD-7782',
            date: '2024-05-15',
            status: 'Delivered',
            total: 124.99,
            items: [{ name: 'Inshore Master Pack', quantity: 1 }]
        },
        {
            id: '#ORD-8821',
            date: '2024-06-02',
            status: 'Processing',
            total: 45.50,
            items: [{ name: 'Clammy Bits', quantity: 2 }, { name: 'Circle Hooks', quantity: 1 }]
        }
    ]
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
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Accept any login for demo purposes
                const loggedInUser = { ...MOCK_USER, email };
                setUser(loggedInUser);
                localStorage.setItem('heyskipper_user', JSON.stringify(loggedInUser));
                resolve(true);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('heyskipper_user');
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser: User = { ...MOCK_USER, name, email, orders: [] };
                setUser(newUser);
                localStorage.setItem('heyskipper_user', JSON.stringify(newUser));
                resolve(true);
            }, 800);
        });
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('heyskipper_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
