import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginCall } from '../apiCalls';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const { isFetching, dispatch } = useContext(AuthContext) || {};
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClick = (e: React.FormEvent): void => {
        e.preventDefault();
        if (email.current && password.current && dispatch) {
            loginCall(
                { email: email.current.value, password: password.current.value },
                dispatch
            );
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
                    <form onSubmit={handleClick} className="h-[300px] max-w-auth-box p-[25px] bg-white rounded-[10px] flex flex-col justify-between">
                        <input
                            placeholder="Email"
                            type="email"
                            required
                            className="h-[50px] rounded-[10px] border border-gray-400 text-lg pl-5 focus:outline-none"
                            ref={email}
                        />
                        <div className="relative">
                            <input
                                placeholder="Password"
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
                        <button
                            className="h-[50px] rounded-[10px] border-none bg-[#1775ee] text-white text-xl font-medium cursor-pointer disabled:cursor-not-allowed hover:bg-[#166fe5] transition-colors duration-200"
                            type="submit"
                            disabled={isFetching}
                        >
                            {isFetching ? (
                                <CircularProgress color="inherit" size="20px" />
                            ) : (
                                'Log In'
                            )}
                        </button>
                        <Link
                            to="/forgot-password"
                            className="text-center text-[#1775ee] hover:underline"
                        >
                            Forgot Password?
                        </Link>
                        <Link
                            to="/register"
                            className="w-fit py-[5px] px-5 self-center flex items-center justify-center text-center h-[50px] rounded-[10px] border-none bg-[#42b72a] text-white text-xl font-medium cursor-pointer no-underline hover:bg-[#36a420] transition-colors duration-200"
                        >
                            Create a New Account
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 