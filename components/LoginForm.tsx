
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, requestPasswordReset } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = login(email, password);
        if (result.success) {
            addToast(`Selamat datang, ${result.user?.name}!`, 'success');
            // No onSuccess call needed, context will trigger re-render
        } else {
            setError(result.message);
        }
    };
    
    const handleForgotPassword = () => {
        if (!email) {
            addToast("Silakan masukkan email Anda terlebih dahulu.", 'error');
            return;
        }
        const result = requestPasswordReset(email);
        if (result.success) {
            addToast("Permintaan reset password telah dikirim ke admin.", 'success');
        } else {
            addToast(result.message, 'error');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-slate-300">Password</label>
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:text-sky-400">Lupa Sandi?</button>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
                />
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary"
            >
                Login
            </button>
             <p className="text-sm text-center text-slate-400">
                Belum punya akun?{' '}
                <button type="button" onClick={onSwitchToRegister} className="font-medium text-primary hover:text-sky-400">
                    Daftar di sini
                </button>
            </p>
        </form>
    );
};

export default LoginForm;