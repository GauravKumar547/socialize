import React, { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import clientApi from '../network/network';

const ResetPassword: React.FC = () => {
    const password = useRef<HTMLInputElement>(null);
    const confirmPassword = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            setMessage('Invalid reset link. Please request a new password reset.');
            setIsSuccess(false);
            return;
        }
        setToken(resetToken);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!password.current?.value || !confirmPassword.current?.value) {
            setMessage('Please fill in all fields.');
            setIsSuccess(false);
            return;
        }

        if (password.current.value !== confirmPassword.current.value) {
            setMessage('Passwords do not match.');
            setIsSuccess(false);
            return;
        }

        if (password.current.value.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            setIsSuccess(false);
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await clientApi.post<unknown>('/auth/reset-password', {
                token: token,
                newPassword: password.current.value
            });
            setIsSuccess(true);
            setMessage('Password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage('Failed to reset password. Please try again.');
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
                    <form onSubmit={handleSubmit} className="h-[400px] max-w-auth-box p-[25px] bg-white rounded-[10px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-center mb-5">Reset Password</h2>
                            <p className="text-center text-gray-600 mb-5">
                                Enter your new password below.
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                placeholder="New Password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 pr-12 focus:outline-none w-full"
                                ref={password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                placeholder="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 pr-12 focus:outline-none w-full"
                                ref={confirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        {message && (
                            <div className={`text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            className="h-[50px] rounded-[10px] border-none bg-[#1775ee] text-white text-xl font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-[#166fe5] transition-colors duration-200"
                            type="submit"
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? (
                                <CircularProgress color="inherit" size="20px" />
                            ) : (
                                'Reset Password'
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

export default ResetPassword; 