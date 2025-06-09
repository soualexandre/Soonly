// middleware/auth.ts
import ts from 'typescript';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated && !authStore.loading) {
        await authStore.initAuth();
    }

    if (!authStore.isAuthenticated) {
        const redirectTo = to.fullPath;

        if (to.path !== '/login' && to.path !== '/register') {
            return navigateTo(`/login?redirect=${encodeURIComponent(redirectTo)}`);
        }
    }

    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/');
    }

    if (authStore.shouldRefreshToken) {
        try {
            await authStore.refreshAuthToken();
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            return navigateTo('/login');
        }
    }
});

export const guestMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated && !authStore.loading) {
        await authStore.initAuth();
    }

    if (authStore.isAuthenticated) {
        const redirect = to.query.redirect as string;
        return navigateTo(redirect || '/');
    }
});

export const adminMiddleware = defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        await authStore.initAuth();
    }

    if (!authStore.isAuthenticated) {
        const redirectTo = to.fullPath;
        return navigateTo(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }

    const user = authStore.currentUser;
    //@ts-ignore
    if (!user || user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado. Permissões de administrador necessárias.'
        });
    }
});

export const useAuthGuard = () => {
    const authStore = useAuthStore();
    const router = useRouter();
    const route = useRoute();

    const requireAuth = async (redirectTo?: string) => {
        if (!authStore.isAuthenticated) {
            await authStore.initAuth();
        }

        if (!authStore.isAuthenticated) {
            const redirect = redirectTo || route.fullPath;
            await router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
            return false;
        }

        return true;
    };

    const requireGuest = async (redirectTo: string = '/') => {
        if (!authStore.isAuthenticated) {
            await authStore.initAuth();
        }

        if (authStore.isAuthenticated) {
            await router.push(redirectTo);
            return false;
        }

        return true;
    };

    const requireRole = async (role: string, redirectTo?: string) => {
        const isAuth = await requireAuth(redirectTo);
        if (!isAuth) return false;

        const user = authStore.currentUser;
        //@ts-ignore
        if (!user || user.role !== role) {
            throw createError({
                statusCode: 403,
                statusMessage: `Acesso negado. Permissões de ${role} necessárias.`
            });
        }

        return true;
    };

    return {
        requireAuth,
        requireGuest,
        requireRole,
    };
};