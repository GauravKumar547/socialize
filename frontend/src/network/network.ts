import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { handleApiError } from '@/utils/helpers';
import type { IApiClient, IApiError } from '@/types';

class ApiClient implements IApiClient {
    private readonly client: AxiosInstance;

    constructor(baseURL: string = API_BASE_URL) {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(handleApiError(error));
            }
        );

        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                const apiError = handleApiError(error);

                if (apiError.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }

                return Promise.reject(apiError);
            }
        );
    }

    async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};
            if (params) {
                config.params = params;
            }

            const response = await this.client.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
        try {
            const response = await this.client.post<T>(url, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
        try {
            const response = await this.client.put<T>(url, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async delete<T>(url: string, data?: Record<string, unknown>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};
            if (data) {
                config.data = data;
            }

            const response = await this.client.delete<T>(url, config);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async patch<T>(url: string, data?: Record<string, unknown>): Promise<T> {
        try {
            const response = await this.client.patch<T>(url, data);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress);
                    }
                },
            };

            const response = await this.client.post<T>(url, formData, config);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async downloadFile(url: string, filename: string): Promise<void> {
        try {
            const response = await this.client.get(url, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            throw handleApiError(error);
        }
    }

    cancelRequest(source: AbortController): void {
        source.abort();
    }

    createCancelToken(): AbortController {
        return new AbortController();
    }
}

const clientApi = new ApiClient();

export default clientApi;
export { ApiClient };
export type { IApiClient, IApiError }; 