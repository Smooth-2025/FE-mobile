import { lazy, Suspense, useState, useEffect, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router-dom';
import { tokenUtils } from '@/utils/token';
import api from '@/apis';

// page lazy import
const AppLayout = lazy(() => import('@/layout/AppLayout'));
const HomePage = lazy(() => import('@pages/home/HomePage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const DrivePage = lazy(() => import('@pages/drive/DrivePage'));
const ReportPage = lazy(() => import('@pages/report/ReportPage'));
const ReportDetailPage = lazy(() => import('@pages/report/ReportDetailPage'));
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

// 권한 여부에 따른 가드 설정 (브라우저 재시작 시 세션 복구 기능 포함)
function RequireAuth({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. sessionStorage에 토큰이 있으면 바로 인증 성공
        if (tokenUtils.hasAccessToken()) {
          setAuthState('authenticated');
          return;
        }

        // 2. sessionStorage에 토큰이 없으면 Refresh Token으로 복구 시도
        console.warn('브라우저 재시작 감지 - 세션 복구 시도');
        const response = await api.post('/api/users/auth/refresh');
        
        if (response.data?.accessToken) {
          tokenUtils.setAccessToken(response.data.accessToken);
          setAuthState('authenticated');
          console.warn('세션 복구 성공');
          return;
        }
      } catch {
        console.error('세션 복구 실패 - 로그인 필요');
      }

      // 3. 복구 실패 시 로그인 페이지로
      setAuthState('unauthenticated');
    };

    checkAuth();
  }, []);

  if (authState === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        로그인 확인 중...
      </div>
    );
  }

  return authState === 'authenticated' ? <>{children}</> : <Navigate to="/login" replace />;
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
      { path: 'report/:id', element: <ReportDetailPage />, handle: { hideBottomNav: true } },
      { path: 'mypage', element: <MyPage /> },
      { path: 'mypage/profile', element: <ProfilePage />, handle: { hideBottomNav: true } },
      {
        path: 'mypage/ChangePasswordPage',
        element: <ChangePasswordPage />,
        handle: { hideBottomNav: true },
      },
      { path: 'mypage/emergency', element: <EmergencyPage />, handle: { hideBottomNav: true } },
      {
        path: 'mypage/emergency/edit',
        element: <EmergencyEditPage />,
        handle: { hideBottomNav: true },
      },
      { path: 'mypage/reports', element: <ReportListPage />, handle: { hideBottomNav: true } },
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
