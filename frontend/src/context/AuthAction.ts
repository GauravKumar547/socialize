import { AUTH_ACTIONS } from '@/utils/constants';
import type { IAuthAction, IUser } from '@/types';

/**
 * Authentication action creators
 */
export const loginStart = (): IAuthAction => ({
    type: AUTH_ACTIONS.LOGIN_START,
});

export const loginSuccess = (user: IUser): IAuthAction => ({
    type: AUTH_ACTIONS.LOGIN_SUCCESS,
    payload: user,
});

export const loginFailure = (error: Error): IAuthAction => ({
    type: AUTH_ACTIONS.LOGIN_FAILURE,
    payload: error,
});

export const logout = (): IAuthAction => ({
    type: AUTH_ACTIONS.LOGOUT,
}); 