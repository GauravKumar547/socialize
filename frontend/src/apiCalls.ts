import clientApi from '@/network/network';
import { setItem } from '@/utils/helpers';
import { loginStart, loginSuccess, loginFailure } from '@/context/AuthAction';
import type { ILoginCredentials, IUser, IAuthAction } from '@/types';

export const loginCall = async (
    userCredential: ILoginCredentials,
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    dispatch(loginStart());

    try {
        const user = await clientApi.post<IUser>('auth/login', userCredential as unknown as Record<string, unknown>);
        dispatch(loginSuccess(user));
        setItem('user', user);
    } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error : new Error('Login failed')));
    }
}; 