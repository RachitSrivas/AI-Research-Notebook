import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/login' : '/signup';
            const res = await api.post(endpoint, { email, password });
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            } else {
                setIsLogin(true);
                setError('Signup successful! Please log in.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login to Notebook' : 'Create Account'}</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
                    />
                    <input 
                        type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>
                
                <p className="text-center mt-4 text-sm text-gray-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </p>
            </div>
        </div>
    );
}