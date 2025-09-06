import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';

// page lazy import
const HomePage = lazy(() => import('@pages/home/HomePage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const DrivePage = lazy(() => import('@pages/drive/DrivePage'));
const ReportPage = lazy(() => import('@pages/report/ReportPage'));
const MyPage = lazy(() => import('@pages/myPage/MyPage'));
const ProfilePage = lazy(() => import('@pages/myPage/ProfilePage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const EmailInputPage = lazy(() => import('@pages/auth/EmailInputPage'));
const EmailVerificationPage = lazy(() => import('@pages/auth/EmailVerificationPage'));
const ProfileInputPage = lazy(() => import('@pages/auth/ProfileInputPage'));
const TermsAgreementPage = lazy(() => import('@pages/auth/TermsAgreementPage'));
const EmergencyInfoPage = lazy(() => import('@pages/auth/EmergencyInfoPage'));
const SignupCompletePage = lazy(() => import('@pages/auth/SignupCompletePage'));
const ChangePasswordPage = lazy(() => import('@/pages/myPage/ChangePasswordPage'));
const EmergencyPage = lazy(() => import('@/pages/myPage/EmergencyPage'));
const EmergencyEditPage = lazy(() => import('@/pages/myPage/EmergencyEditPage'));
const ReportListPage = lazy(() => import('@/pages/myPage/ReportListPage'));

// 권한 여부에 따른 가드 설정
function RequireAuth({ children }: { children: ReactNode }) {
  const isAuth = Boolean(sessionStorage.getItem('smooth_access_token')); // 올바른 토큰 키 사용
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;

}

const routes: RouteObject[] = [
  // 공개 페이지
  { path: '/login', element: <LoginPage /> },
  { path: '/signup/email', element: <EmailInputPage /> },
  { path: '/signup/verification', element: <EmailVerificationPage /> },
  { path: '/signup/profile', element: <ProfileInputPage /> },
  { path: '/signup/terms', element: <TermsAgreementPage /> },
  { path: '/signup/emergency', element: <EmergencyInfoPage /> },
  { path: '/signup/complete', element: <SignupCompletePage /> },

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
      { path: 'mypage/profile', element: <ProfilePage />, handle: { hideBottomNav: true } },
      { path: 'mypage/ChangePasswordPage', element: <ChangePasswordPage /> , handle: { hideBottomNav: true } },
      { path: 'mypage/emergency', element: <EmergencyPage /> , handle: { hideBottomNav: true } },
      { path: 'mypage/emergency/edit', element: <EmergencyEditPage /> , handle: { hideBottomNav: true } },
      { path: 'mypage/reports', element: <ReportListPage /> , handle: { hideBottomNav: true } },
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
