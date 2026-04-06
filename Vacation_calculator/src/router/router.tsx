import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/home-page'));

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div className="p-6 text-slate-600">Loading...</div>}>
        <HomePage />
      </Suspense>
    )
  }
]);
