import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import clientApi from '../network/network';

const ForgotPassword: React.FC = () => {
    const email = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!email.current?.value) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            await clientApi.post<unknown>('/auth/forgot-password', {
                email: email.current.value
            });
            setIsSuccess(true);
            setMessage('Password reset link has been sent to your email!');
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage('Failed to send reset link. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen h-screen bg-[#f0f2f5] flex items-center justify-center">
            <div className="w-3/5 h-[70%] gap-5 flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-[50px] font-extrabold text-[#1775ee] mb-[10px]">Socialize</h3>
                    <span className="text-2xl">
                        Connect with friends and the world around you on Socialize.
                    </span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="h-[300px] max-w-auth-box p-[25px] bg-white rounded-[10px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-center mb-5">Forgot Password</h2>
                            <p className="text-center text-gray-600 mb-5">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <input
                            placeholder="Email"
                            type="email"
                            required
                            className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 focus:outline-none"
                            ref={email}
                        />

                        {message && (
                            <div className={`text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            className="h-[50px] rounded-[10px] border-none bg-[#1775ee] text-white text-xl font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-[#166fe5] transition-colors duration-200"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress color="inherit" size="20px" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <Link
                            to="/login"
                            className="text-center text-[#1775ee] hover:underline"
                        >
                            Back to Login
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 