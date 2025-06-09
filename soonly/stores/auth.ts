import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import { defineStore } from 'pinia';
import api from '~/utils/axios';
import {useToast}  from 'vue-toastification'

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
    preferences?: {
        language: string;
        theme: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface AuthStoreState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStoreState => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    }),

    actions: {
        async initAuth(): Promise<void> {
            if (process.client) {
                const token = localStorage.getItem('soonly-auth-token');
                const refreshToken = localStorage.getItem('soonly-refresh-token');

                if (token) {
                    this.token = token;
                    this.refreshToken = refreshToken;

                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    await this.verifyToken();
                }
            }
        },

        async verifyToken(): Promise<void> {
            if (!this.token) return;

            try {
                const response = await api.get<User>('/auth/me');
                this.user = response.data;
                this.isAuthenticated = true;
            } catch (error) {
                this.logout();
            }
        },

        async login(credentials: LoginCredentials): Promise<void> {
            this.loading = true;
            this.error = null;
            const toast = useToast()

            try {
                const response = await api.post<AuthResponse>('/auth/login', credentials);
                const { user, token, refreshToken, expiresIn } = response.data;

                this.setAuthData(user, token, refreshToken);

                if (process.client) {
                    localStorage.setItem('soonly-auth-token', token);
                    if (refreshToken) {
                        localStorage.setItem('soonly-refresh-token', refreshToken);
                    }

                    if (credentials.rememberMe) {
                        const expiryDate = new Date(Date.now() + expiresIn * 1000);
                        localStorage.setItem('soonly-auth-expiry', expiryDate.toISOString());
                    }
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            } catch (error) {
                toast.error('Erro ao fazer login. Verifique suas credenciais.');
                this.handleAuthError(error, 'Erro ao fazer login. Verifique suas credenciais.');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(credentials: RegisterCredentials): Promise<void> {
            this.loading = true;
            this.error = null;
                  const toast = useToast()

            try {
                if (credentials.password !== credentials.confirmPassword) {
                    throw new Error('As senhas não coincidem');
                }

                const response = await api.post<AuthResponse>('/auth/register', {
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                });

                const { user, token, refreshToken } = response.data;
                this.setAuthData(user, token, refreshToken);

                if (process.client) {
                    localStorage.setItem('soonly-auth-token', token);
                    if (refreshToken) {
                        localStorage.setItem('soonly-refresh-token', refreshToken);
                    }
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            } catch (error) {
                toast.error('Erro ao criar conta. Tente novamente.')
                this.handleAuthError(error, 'Erro ao criar conta. Tente novamente.');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout(): Promise<void> {
            try {
                if (this.token) {
                    await api.post('/auth/logout');
                }
            } catch (error) {
                console.warn('Erro ao fazer logout no servidor:', error);
            } finally {
                this.clearAuthData();
            }
        },

        // Esqueceu senha
        async forgotPassword(email: string): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                await api.post('/auth/forgot-password', { email });
            } catch (error) {
                this.handleAuthError(error, 'Erro ao enviar email de recuperação.');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem');
                }

                await api.post('/auth/reset-password', {
                    token,
                    password,
                    confirmPassword,
                });
            } catch (error) {
                this.handleAuthError(error, 'Erro ao redefinir senha.');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(userData: Partial<User>): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.put<User>('/auth/profile', userData);
                this.user = response.data;
            } catch (error) {
                this.handleAuthError(error, 'Erro ao atualizar perfil.');
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async refreshAuthToken(): Promise<void> {
            if (!this.refreshToken) {
                this.logout();
                return;
            }

            try {
                const response = await api.post<{ token: string; refreshToken?: string }>('/auth/refresh', {
                    refreshToken: this.refreshToken,
                });

                const { token, refreshToken } = response.data;
                this.token = token;

                if (refreshToken) {
                    this.refreshToken = refreshToken;
                }

                if (process.client) {
                    localStorage.setItem('soonly-auth-token', token);
                    if (refreshToken) {
                        localStorage.setItem('soonly-refresh-token', refreshToken);
                    }
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            } catch (error) {
                this.logout();
                throw error;
            }
        },

        setAuthData(user: User, token: string, refreshToken?: string): void {
            this.user = user;
            this.token = token;
            this.refreshToken = refreshToken || null;
            this.isAuthenticated = true;
            this.error = null;
        },

        clearAuthData(): void {
            this.user = null;
            this.token = null;
            this.refreshToken = null;
            this.isAuthenticated = false;
            this.error = null;

            if (process.client) {
                localStorage.removeItem('soonly-auth-token');
                localStorage.removeItem('soonly-refresh-token');
                localStorage.removeItem('soonly-auth-expiry');
            }

            delete api.defaults.headers.common['Authorization'];
        },

        handleAuthError(error: unknown, fallbackMessage: string): void {
            let message = fallbackMessage;

            if (isAxiosError(error)) {
                const axiosError = error as AxiosError;

                if (axiosError.response?.status === 401) {
                    message = 'Credenciais inválidas';
                } else if (axiosError.response?.status === 403) {
                    message = 'Acesso negado';
                } else if (axiosError.response?.status === 422) {
                    message = 'Dados inválidos. Verifique os campos.';
                } else if (axiosError.response?.status === 429) {
                    message = 'Muitas tentativas. Tente novamente mais tarde.';
                } else {
                    message = axiosError.message || fallbackMessage;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }

            this.error = message;
            console.error('[Auth Error]', message);
        },

        clearError(): void {
            this.error = null;
        },
    },

    getters: {
        isLoggedIn: (state): boolean => state.isAuthenticated && !!state.user,

        currentUser: (state): User | null => state.user,

        hasError: (state): boolean => !!state.error,

        isLoading: (state): boolean => state.loading,

        userInitials: (state): string => {
            if (!state.user?.name) return '';

            return state.user.name
                .split(' ')
                .map(word => word.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2);
        },

        shouldRefreshToken: (state): boolean => {
            if (!state.token || !process.client) return false;

            const expiryStr = localStorage.getItem('soonly-auth-expiry');
            if (!expiryStr) return false;

            const expiry = new Date(expiryStr);
            const now = new Date();
            const timeUntilExpiry = expiry.getTime() - now.getTime();

            return timeUntilExpiry < 5 * 60 * 1000;
        },
    },
});