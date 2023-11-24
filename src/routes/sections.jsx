import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/sections/dashboard/app-view'));
export const BlogPage = lazy(() => import('src/sections/blog/blog-view'));
export const UserPage = lazy(() => import('src/sections/user/user-view'));
export const LoginPage = lazy(() => import('src/sections/login/login-view'));
export const LessonsPage = lazy(() => import('src/sections/lessons/LessonsView'));
export const LessonFormPage = lazy(() => import('src/sections/lessons/LessonForm'));
export const Page404 = lazy(() => import('src/sections/error/not-found-view'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'lessons', element: <LessonsPage /> },
        { path: 'lessons/:lesson', element: <LessonFormPage /> },
        { path: 'lessons/new', element: <LessonFormPage /> },
        { path: 'quizzes', element: <BlogPage /> },
        { path: 'placement-test', element: <UserPage /> },
        { path: 'settings', element: <UserPage /> },
        { path: 'feedback', element: <UserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
