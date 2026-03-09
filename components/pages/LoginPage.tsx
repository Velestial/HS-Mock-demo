import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, register } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: ''
    });

    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileReady, setTurnstileReady] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isRegistering) {
                if (!formData.firstName || !formData.email || !formData.password) {
                    throw new Error('All fields are required');
                }
                if (!turnstileToken) {
                    throw new Error('Please complete the security check');
                }
                const success = await register(formData.firstName, formData.email, formData.password);
                if (!success) {
                    throw new Error('Account created but auto-login failed. Please log in manually.');
                }
            } else {
                if (!formData.email || !formData.password) {
                    throw new Error('Email and password are required');
                }
                await login(formData.email, formData.password);
            }
            onLoginSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <span className="font-mono text-xs uppercase text-neutral-500 mb-2 block">/// SECURE_ACCESS</span>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{isRegistering ? 'Join Crew' : 'Welcome Back'}</h1>
                    <p className="text-neutral-600">
                        {isRegistering
                            ? 'Create your account to track orders and save details.'
                            : 'Enter your credentials to access your captain\'s log.'}
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-50 border border-black p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <div className="w-16 h-16 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 font-mono">
                                ERROR: {error}
                            </div>
                        )}

                        {isRegistering && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-white border border-black h-12 pl-10 pr-4 font-mono text-sm focus:outline-none focus:bg-black focus:text-white transition-colors"
                                        placeholder="Your First Name"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-black h-12 pl-10 pr-4 font-mono text-sm focus:outline-none focus:bg-black focus:text-white transition-colors"
                                    placeholder="captain@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white border border-black h-12 pl-10 pr-4 font-mono text-sm focus:outline-none focus:bg-black focus:text-white transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isRegistering && (
                            <div className="flex justify-center">
                                <Turnstile
                                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                    onSuccess={(token) => { setTurnstileToken(token); setTurnstileReady(true); }}
                                    onError={() => { setTurnstileToken(''); setTurnstileReady(false); }}
                                    onExpire={() => { setTurnstileToken(''); setTurnstileReady(false); }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || (isRegistering && !turnstileReady)}
                            className="w-full bg-black text-white h-14 flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors uppercase font-bold text-sm tracking-widest disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>{isRegistering ? 'Create Account' : 'Login'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-black/10 text-center">
                        <button
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setTurnstileToken('');
                                setTurnstileReady(false);
                                setError(null);
                            }}
                            className="text-xs font-mono uppercase text-neutral-500 hover:text-black hover:underline underline-offset-4"
                        >
                            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                        </button>

                        {!isRegistering && (
                            <div className="mt-4 text-center">
                                <a
                                    href="https://heyskipper.com/my-account/lost-password"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono uppercase text-neutral-500 hover:text-black hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="text-center mt-8">
                    <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100">
                        Cancel & Return Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
