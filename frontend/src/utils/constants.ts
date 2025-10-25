import type { RelationshipStatus, AuthActionType } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'ws://localhost:8080';

export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    MESSENGER: '/messenger',
    SETTINGS: '/settings',
} as const;

export const AUTH_ACTIONS: Record<AuthActionType, AuthActionType> = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
} as const;

export const RELATIONSHIP_STATUS: Record<RelationshipStatus, RelationshipStatus> = {
    single: 'single',
    'in-relationship': 'in-relationship',
    married: 'married',
    complicated: 'complicated',
} as const;

export const RELATIONSHIP_LABELS: Record<RelationshipStatus, string> = {
    single: 'Single',
    'in-relationship': 'In a Relationship',
    married: 'Married',
    complicated: 'It\'s Complicated',
} as const;

export const FILE_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
} as const;

export const UPLOAD_STATUS = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

export const LOADING_STATES = {
    IDLE: 'idle',
    PENDING: 'pending',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const;

export const TOAST_POSITIONS = {
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right',
} as const;

export const VALIDATION_RULES = {
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MESSAGE: 'Please enter a valid email address',
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        MESSAGE: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
    USERNAME: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 20,
        PATTERN: /^[a-zA-Z0-9_]+$/,
        MESSAGE: 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores',
    },
} as const;

export const FIREBASE_ERRORS = {
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/weak-password': 'Password is too weak',
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'User account is disabled',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    SEND_MESSAGE: 'send_message',
    RECEIVE_MESSAGE: 'receive_message',
    USER_ONLINE: 'user_online',
    USER_OFFLINE: 'user_offline',
    TYPING: 'typing',
    STOP_TYPING: 'stop_typing',
} as const;

export const DEBOUNCE_DELAY = {
    SHORT: 300,
    MEDIUM: 500,
    LONG: 1000,
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

export const IMAGE_CONSTRAINTS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
} as const;

export const POST_CONSTRAINTS = {
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const MESSAGE_CONSTRAINTS = {
    MAX_TEXT_LENGTH: 1000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
} as const;

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
} as const;

export const Z_INDEX = {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOAST: 1100,
    TOOLTIP: 1200,
} as const;

export const THEME_COLORS = {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#4caf50',
    WARNING: '#ff9800',
    ERROR: '#f44336',
    INFO: '#2196f3',
} as const;

export const QUERY_KEYS = {
    USER: 'user',
    POSTS: 'posts',
    MESSAGES: 'messages',
    CONVERSATIONS: 'conversations',
    FRIENDS: 'friends',
    NOTIFICATIONS: 'notifications',
} as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
} as const;

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
    POST_CREATED: 'Post created successfully!',
    POST_UPDATED: 'Post updated successfully!',
    POST_DELETED: 'Post deleted successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    MESSAGE_SENT: 'Message sent successfully!',
    FOLLOW_SUCCESS: 'Successfully followed user!',
    UNFOLLOW_SUCCESS: 'Successfully unfollowed user!',
} as const; 