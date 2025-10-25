import { AUTH_ACTIONS } from '@/utils/constants';
import type { IAuthState, IAuthAction } from '@/types';

/**
 * Authentication state reducer
 */
const AuthReducer = (state: IAuthState, action: IAuthAction): IAuthState => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isFetching: true,
                error: false,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload && 'username' in action.payload ? action.payload : null,
                isFetching: false,
                error: false,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isFetching: false,
                error: true,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isFetching: false,
                error: false,
            };

        default:
            return state;
    }
};

export default AuthReducer; 