import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';

// page lazy import
const HomePage = lazy(() => import('@pages/home/HomePage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@pages/auth/SignupPage'));
const DrivePage = lazy(() => import('@pages/drive/DrivePage'));
const ReportPage = lazy(() => import('@pages/report/ReportPage'));
const MyPage = lazy(() => import('@pages/myPage/MyPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const EmailInputPage = lazy(() => import('@pages/auth/EmailInputPage'));
const EmailVerificationPage = lazy(() => import('@pages/auth/EmailVerificationPage'));
const ProfileInputPage = lazy(() => import('@pages/auth/ProfileInputPage'));
const TermsAgreementPage = lazy(() => import('@pages/auth/TermsAgreementPage'))

// 권한 여부에 따른 가드 설정
function RequireAuth({ children }: { children: ReactNode }) {
  const isAuth = Boolean(localStorage.getItem('token')); // 권한 부분은 로직에 맞게 수정
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

const routes: RouteObject[] = [
  // 공개 페이지
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/signup/email', element: <EmailInputPage />},
  { path: '/signup/verification', element: <EmailVerificationPage />},
  { path: '/signup/profile', element: <ProfileInputPage />},
  { path: '/signup/terms', element: <TermsAgreementPage />},
  // 보호 페이지(레이아웃 하위)
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'drive', element: <DrivePage /> },
      { path: 'report', element: <ReportPage /> },
      { path: 'mypage', element: <MyPage /> },
      //-- 하단 네비바 제거시(handle) 사용   --
      // { path: 'mypage/:id', element: <MyPage />, handle: { hideBottomNav: true } },
    ],
  },
  // 404
  { path: '*', element: <NotFoundPage /> },
];

const router = createBrowserRouter(routes);
export default function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
