import React, { createContext, useReducer, type ReactNode } from 'react';
import { getItem } from '@/utils/helpers';
import AuthReducer from './AuthReducer';
import type { IAuthState, IAuthContextValue, IUser } from '@/types';

const INITIAL_STATE: IAuthState = {
    user: getItem<IUser>('user'),
    isFetching: false,
    error: false,
};

export const AuthContext = createContext<IAuthContextValue>({
    user: null,
    isFetching: false,
    error: false,
    dispatch: () => { },
});

interface IAuthProviderProps {
    readonly children: ReactNode;
}

export const AuthContextProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 