
export interface IUser {
    readonly _id: string;
    readonly username: string;
    readonly email: string;
    readonly profilePicture?: string;
    readonly coverPicture?: string;
    readonly followers: readonly string[];
    readonly following: readonly string[];
    readonly description?: string;
    readonly city?: string;
    readonly from?: string;
    readonly relationship?: number;
    readonly isAdmin: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface IPost {
    readonly _id: string;
    readonly user_id: string | IUser;
    readonly description: string;
    readonly image?: string;
    readonly likes: readonly string[];
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface IMessage {
    readonly _id: string;
    readonly conversationId: string;
    readonly sender_id: string;
    readonly text: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface IConversation {
    readonly _id: string;
    readonly members: readonly string[];
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface IOnlineUser {
    readonly user_id: string;
    readonly socket_id: string;
}

export interface ISocketMessage {
    readonly sender_id: string;
    readonly receiver_id: string;
    readonly text: string;
}

export interface IArrivingMessage {
    readonly sender_id: string;
    readonly text: string;
    readonly createdAt: Date;
}

export interface IAuthState {
    readonly user: IUser | null;
    readonly isFetching: boolean;
    readonly error: boolean;
}

export interface IAuthAction {
    readonly type: AuthActionType;
    readonly payload?: IUser | Error;
}

export interface ILoginCredentials {
    readonly email: string;
    readonly password: string;
}

export interface IRegisterCredentials {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
}

export interface IUpdateUserData {
    readonly username?: string;
    readonly description?: string;
    readonly city?: string;
    readonly from?: string;
    readonly relationship?: number;
    readonly profilePicture?: string;
    readonly coverPicture?: string;
}

export interface IApiError {
    readonly message: string;
    readonly status?: number;
    readonly code?: string;
}

export interface IFirebaseConfig {
    readonly apiKey: string;
    readonly authDomain: string;
    readonly projectId: string;
    readonly storageBucket: string;
    readonly messagingSenderId: string;
    readonly appId: string;
    readonly measurementId: string;
}

export interface ISocketUser {
    readonly _id: string;
    readonly username: string;
    readonly profilePicture?: string;
}

export interface ICloseFriend {
    readonly _id: string;
    readonly username: string;
    readonly profilePicture?: string;
}

export interface IOnlineUserProps {
    readonly onlineUsers: readonly IOnlineUser[];
    readonly currentUserId: string;
    readonly setCurrentChat: (conversation: IConversation) => void;
}

export interface IShareFormData {
    readonly description: string;
    readonly img?: string;
}

export interface IPostFormData {
    readonly user_id: string;
    readonly description: string;
    readonly img?: string;
}

export interface IFollowAction {
    readonly user_id: string;
}

export interface ILikeAction {
    readonly user_id: string;
}

export interface IDeletePostAction {
    readonly user_id: string;
}

export interface IUserSearchParams {
    readonly user_id?: string;
    readonly username?: string;
}

export interface IFileUploadResult {
    readonly url: string;
    readonly metadata: Record<string, unknown>;
}

export interface IToastOptions {
    readonly duration?: number;
    readonly position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly icon?: React.ReactNode;
    readonly iconTheme?: {
        readonly primary: string;
        readonly secondary: string;
    };
}


export type AuthActionType =
    | 'LOGIN_START'
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILURE'
    | 'LOGOUT';

export type RelationshipStatus = 'single' | 'in-relationship' | 'married' | 'complicated';

export type FileType = 'image' | 'video' | 'document';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type ConversationType = 'private' | 'group';

export type MessageType = 'text' | 'image' | 'file';

export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export type ThemeMode = 'light' | 'dark';

export type SortOrder = 'asc' | 'desc';

export type PostSortBy = 'createdAt' | 'likes' | 'comments';

export type UserStatus = 'online' | 'offline' | 'away';

export type ModalType = 'settings' | 'post' | 'confirmation' | 'image-preview';

export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

export type NetworkStatus = 'online' | 'offline' | 'reconnecting';

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
    readonly data: T | null;
    readonly loading: boolean;
    readonly error: string | null;
};

// Component props types
export interface IBaseComponentProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children?: React.ReactNode;
}

export interface IWithLoadingProps {
    readonly loading?: boolean;
    readonly loadingComponent?: React.ReactNode;
}

export interface IWithErrorProps {
    readonly error?: string | null;
    readonly errorComponent?: React.ReactNode;
}

// Context types
export interface IAuthContextValue {
    readonly user: IUser | null;
    readonly isFetching: boolean;
    readonly error: boolean;
    readonly dispatch: React.Dispatch<IAuthAction>;
}

// Environment variables
export interface IEnvironmentVariables {
    readonly VITE_API_URL: string;
    readonly VITE_FIREBASE_API_KEY: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string;
    readonly VITE_FIREBASE_PROJECT_ID: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly VITE_FIREBASE_APP_ID: string;
    readonly VITE_FIREBASE_MEASEUREMENT_ID: string;
}

// Form validation types
export interface IFormErrors {
    email?: string;
    password?: string;
    username?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
}

export interface IValidationResult {
    readonly isValid: boolean;
    readonly error?: string;
}

// Upload progress types
export interface IUploadProgress {
    readonly loaded: number;
    readonly total: number;
    readonly percentage: number;
}

// API types
export interface IApiClient {
    readonly get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>;
    readonly post: <T>(url: string, data?: Record<string, unknown>) => Promise<T>;
    readonly put: <T>(url: string, data?: Record<string, unknown>) => Promise<T>;
    readonly delete: <T>(url: string, data?: Record<string, unknown>) => Promise<T>;
} 