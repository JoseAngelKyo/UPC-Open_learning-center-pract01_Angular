import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bookstores',
    loadChildren: () =>
      import('./bookstores/presentation/bookstores.routes')
        .then(m => m.bookstoresRoutes)
  },
  {
    path: '',
    redirectTo: '/bookstores/overview',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found')
        .then(m => m.PageNotFound)
  }
];
