'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import apiClient from '@/api/client';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'participant' | 'staff' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    console.log('🔄 Loading user from token...');
                    const res = await apiClient.get('auth/me');
                    console.log('✅ User loaded:', res.data.data);
                    setUser(res.data.data);
                } catch (err) {
                    console.error('❌ Failed to load user:', err);
                    Cookies.remove('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = (token: string, userData: User) => {
        console.log('🔑 Login successful. Token stored. User:', userData);
        Cookies.set('token', token, { expires: 30 });
        setUser(userData);
        if (userData.role === 'admin') {
            console.log('🚀 Redirecting to Admin Dashboard...');
            router.push('/admin');
        } else {
            console.log('🏠 Redirecting to Home...');
            router.push('/');
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
