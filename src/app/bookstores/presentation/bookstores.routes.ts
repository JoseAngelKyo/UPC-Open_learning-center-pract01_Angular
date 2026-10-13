import { Routes } from '@angular/router';

export const bookstoresRoutes: Routes = [
  {
    path: 'overview',
    loadComponent: () =>
      import('./views/bookstore-list/bookstore-list')
        .then(m => m.BookstoreList)
  }
];
