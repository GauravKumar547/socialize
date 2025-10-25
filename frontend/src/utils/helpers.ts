import type {
    IApiError,
    IUser,
    IFormErrors,
    IValidationResult,
    IUploadProgress,
    RelationshipStatus
} from '@/types';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        PROFILE: '/users/profile',
        UPDATE: '/users/update',
        FRIENDS: '/users/friends',
        SEARCH: '/users/search',
    },
    POSTS: {
        CREATE: '/posts',
        UPDATE: '/posts',
        DELETE: '/posts',
        LIKE: '/posts/like',
        TIMELINE: '/posts/timeline',
    },
    MESSAGES: {
        SEND: '/messages',
        CONVERSATIONS: '/conversations',
    },
} as const;

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

export const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

export const validateLoginForm = (email: string, password: string): IFormErrors => {
    const errors: IFormErrors = {};

    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
};

export const validateRegisterForm = (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): IFormErrors => {
    const errors: IFormErrors = {};

    if (!username.trim()) {
        errors.username = 'Username is required';
    } else if (!isValidUsername(username)) {
        errors.username = 'Username must be 3-20 characters long and contain only letters, numbers, and underscores';
    }

    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};

export const validatePostContent = (content: string): IValidationResult => {
    if (!content.trim()) {
        return {
            isValid: false,
            error: 'Post content cannot be empty',
        };
    }

    if (content.length > 500) {
        return {
            isValid: false,
            error: 'Post content cannot exceed 500 characters',
        };
    }

    return {
        isValid: true,
    };
};

export const validateMessageContent = (content: string): IValidationResult => {
    if (!content.trim()) {
        return {
            isValid: false,
            error: 'Message cannot be empty',
        };
    }

    if (content.length > 1000) {
        return {
            isValid: false,
            error: 'Message cannot exceed 1000 characters',
        };
    }

    return {
        isValid: true,
    };
};

export const formatDisplayName = (user: IUser): string => {
    if (user.username) {
        return user.username;
    }
    return 'Unknown User';
};

export const formatPostDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return 'just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
        return date.toLocaleDateString();
    }
};

export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatLikesCount = (count: number): string => {
    if (count === 0) {
        return '';
    } else if (count === 1) {
        return '1 person likes this';
    } else {
        return `${count} people like this`;
    }
};

export const formatFollowersCount = (count: number): string => {
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        return `${(count / 1000).toFixed(1)}K`;
    } else {
        return `${(count / 1000000).toFixed(1)}M`;
    }
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength).trim() + '...';
};

export const setItem = (key: string, value: unknown): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
};

export const getItem = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

export const removeItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
    }
};

export const clearStorage = (): void => {
    try {
        localStorage.clear();
    } catch {
    }
};

export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .trim()
        .replace(/\s+/g, ' ');
};

export const isOnline = (): boolean => {
    return navigator.onLine;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

export const downloadFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

export const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const handleApiError = (error: unknown): IApiError => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        return {
            message: axiosError.response?.data?.message || 'An error occurred',
            ...(axiosError.response?.status !== undefined && { status: axiosError.response.status }),
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
        };
    }

    return {
        message: 'An unknown error occurred',
    };
};

export const retryAsync = async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retryAsync(fn, retries - 1, delay);
        }
        throw error;
    }
};

export const createUploadProgress = (): IUploadProgress => {
    return {
        loaded: 0,
        total: 0,
        percentage: 0,
    };
};

export const calculateUploadProgress = (loaded: number, total: number): IUploadProgress => {
    const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
    return {
        loaded,
        total,
        percentage,
    };
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const getRelationshipDisplayText = (status: RelationshipStatus): string => {
    const statusMap: Record<RelationshipStatus, string> = {
        'single': 'Single',
        'married': 'Married',
        'in-relationship': 'In a relationship',
        'complicated': "It's complicated",
    };

    return statusMap[status] || 'Not specified';
};

export const isValidImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const parseHashtags = (text: string): readonly string[] => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
};

export const parseMentions = (text: string): readonly string[] => {
    const mentions = text.match(/@[a-zA-Z0-9_]+/g);
    return mentions ? mentions.map(mention => mention.slice(1)) : [];
};

export const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

export const generateAvatarUrl = (username: string, size: number = 100): string => {
    const firstLetter = username.charAt(0).toUpperCase();
    const backgroundColor = Math.abs(username.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 16777215;
    const bgColor = backgroundColor.toString(16).padStart(6, '0');

    return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#${bgColor}"/>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-size="${size * 0.4}" font-family="Arial, sans-serif">${firstLetter}</text>
        </svg>
    `)}`;
};

export const sortByDate = <T extends { createdAt: string }>(items: readonly T[], ascending: boolean = false): readonly T[] => {
    return [...items].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
    });
};

export const groupByDate = <T extends { createdAt: string }>(items: readonly T[]): Record<string, readonly T[]> => {
    return items.reduce((groups, item) => {
        const date = new Date(item.createdAt).toDateString();
        return {
            ...groups,
            [date]: [...(groups[date] || []), item],
        };
    }, {} as Record<string, readonly T[]>);
};

export const paginateArray = <T>(array: readonly T[], page: number, limit: number): readonly T[] => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return array.slice(startIndex, endIndex);
};

export const createSearchFilter = <T>(searchTerm: string, searchKeys: readonly (keyof T)[]): ((item: T) => boolean) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (item: T): boolean => {
        return searchKeys.some(key => {
            const value = item[key];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerSearchTerm);
            }
            return false;
        });
    };
};

export default {
    API_ENDPOINTS,
    isValidEmail,
    isValidPassword,
    isValidUsername,
    validateLoginForm,
    validateRegisterForm,
    validatePostContent,
    validateMessageContent,
    formatDisplayName,
    formatPostDate,
    formatMessageTime,
    formatLikesCount,
    formatFollowersCount,
    truncateText,
    setItem,
    getItem,
    removeItem,
    clearStorage,
    generateRandomId,
    debounce,
    throttle,
    sanitizeInput,
    isOnline,
    copyToClipboard,
    downloadFile,
    getFileExtension,
    isImageFile,
    isVideoFile,
    formatFileSize,
    handleApiError,
    retryAsync,
    createUploadProgress,
    calculateUploadProgress,
    isValidUrl,
    getRelationshipDisplayText,
    isValidImageUrl,
    createSlug,
    parseHashtags,
    parseMentions,
    highlightText,
    generateAvatarUrl,
    sortByDate,
    groupByDate,
    paginateArray,
    createSearchFilter,
}; 