import { lazy, Suspense } from 'react';
import { Outlet, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardLayout from 'src/layouts';
import RequireAuth from './RequireAuth';

export const IndexPage = lazy(() => import('src/sections/dashboard/AppView'));
export const UserPage = lazy(() => import('src/sections/user/UsersView'));
export const FeedbackPage = lazy(() => import('src/sections/feedback/FeedbackView'));
export const LoginPage = lazy(() => import('src/sections/login/LoginView'));
export const PasswordPage = lazy(() => import('src/sections/login/PasswordView'));
export const LessonsPage = lazy(() => import('src/sections/lessons/LessonsView'));
export const LessonFormPage = lazy(() => import('src/sections/lessons/LessonForm'));
export const QuizFormPage = lazy(() => import('src/sections/quizzes/QuizForm'));
export const PlacementTestFormPage = lazy(() => import('src/sections/placement/PlacementTestForm'));
export const Page404 = lazy(() => import('src/sections/error/NotFoundView'));

const router = createBrowserRouter([
  {
    index: true,
    element: <LoginPage />,
  },
  {
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <IndexPage /> },
      { path: 'lessons', element: <LessonsPage /> },
      { path: 'lessons/:lesson', element: <LessonFormPage /> },
      { path: 'lessons/new', element: <LessonFormPage /> },
      { path: 'quizzes', element: <LessonsPage isQuiz={true} /> },
      { path: 'quizzes/new', element: <QuizFormPage /> },
      { path: 'quizzes/:quiz', element: <QuizFormPage /> },
      { path: 'placement-test', element: <PlacementTestFormPage /> },
      { path: 'users', element: <UserPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
    ],
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: 'password',
    element: (
      <Suspense>
        <PasswordPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
