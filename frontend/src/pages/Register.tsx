import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import clientApi from '../network/network';
import type { IRegisterCredentials } from '../types';

const Register: React.FC = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setFormErrors('');
        setIsSubmitting(true);

        const email = emailRef.current?.value?.trim();
        const password = passwordRef.current?.value?.trim();
        const confirmPassword = confirmPasswordRef.current?.value?.trim();
        const username = usernameRef.current?.value?.trim();

        if (!email || !password || !confirmPassword || !username) {
            setFormErrors('All fields are required');
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setFormErrors("Passwords don't match");
            confirmPasswordRef.current?.setCustomValidity("Passwords don't match");
            setIsSubmitting(false);
            return;
        } else {
            confirmPasswordRef.current?.setCustomValidity('');
        }

        if (password.length < 6) {
            setFormErrors('Password must be at least 6 characters long');
            setIsSubmitting(false);
            return;
        }

        const user: IRegisterCredentials = {
            username,
            password,
            email,
            confirmPassword,
        };

        try {
            await clientApi.post<unknown>('/auth/register', user as unknown as Record<string, unknown>);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setFormErrors('Registration failed. Please try again.');
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
                        <input
                            type="text"
                            required
                            ref={usernameRef}
                            placeholder="Username"
                            className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 focus:outline-none"
                            autoComplete="username"
                        />
                        <input
                            type="email"
                            required
                            ref={emailRef}
                            placeholder="Email"
                            className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 focus:outline-none"
                            autoComplete="email"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                ref={passwordRef}
                                minLength={6}
                                placeholder="Password"
                                className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 pr-12 focus:outline-none w-full"
                                autoComplete="new-password"
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
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                ref={confirmPasswordRef}
                                minLength={6}
                                placeholder="Password again"
                                className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 pr-12 focus:outline-none w-full"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </button>
                        </div>

                        {formErrors && (
                            <div className="text-red-600 text-sm text-center">
                                {formErrors}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="h-[50px] rounded-[10px] border-none bg-[#1775ee] text-white text-xl font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-[#166fe5] transition-colors duration-200"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <span className="text-center text-[#1775ee]">Forgot Password?</span>

                        <Link
                            to="/login"
                            className="w-fit py-[5px] px-5 self-center flex items-center justify-center text-center h-[50px] rounded-[10px] border-none bg-[#42b72a] text-white text-xl font-medium cursor-pointer no-underline hover:bg-[#36a420] transition-colors duration-200"
                        >
                            Log into Account
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register; 