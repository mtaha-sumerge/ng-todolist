import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { inject } from '@angular/core';
import { AuthService } from './services/AuthService';

// Lw 3amalt reload khalas barra w e3ml login tany
const canAccess: CanMatchFn = (route, segments) => {
    const router = inject(Router);
    const authService = inject(AuthService)

    if (authService.token)
        return true;
    else return new RedirectCommand(router.parseUrl(''));
}

export const routes: Routes = [
    {
        path: '',
        component: Auth
    },
    {
        path: 'tasks',
        // lazy loading
        loadComponent: () => import('./components/dashboard/dashboard').then(comp => comp.Dashboard),
        runGuardsAndResolvers: 'always',
        canMatch: [canAccess]
    }
];
