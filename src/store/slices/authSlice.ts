import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '@apis/auth';
import { tokenUtils } from '@/utils/token';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types/api';
import type { AxiosError } from 'axios';

interface AuthState {
  // 사용자 정보
  user: User | null;
  // JWT 토큰
  token: string | null;
  // 로딩 상태들
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isLogoutLoading: boolean;
  // 에러 상태
  error: string | null;
  // 인증 여부
  isAuthenticated: boolean;
}

// 초기 상태
const initialState: AuthState = {
  user: null,
  token: tokenUtils.getToken(), // 페이지 새로고침시 토큰 복원
  isLoginLoading: false,
  isRegisterLoading: false,
  isLogoutLoading: false,
  error: null,
  isAuthenticated: !!tokenUtils.getToken(),
};

// 로그인 비동기 액션
export const loginAsync = createAsyncThunk<
  LoginResponse['data'],
  LoginRequest,
  { rejectValue: string }
>(
'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      console.warn('로그인 요청 데이터:', loginData);
      
      const response = await loginUser(loginData);
      
      console.warn('API 원본 응답:', response);
      console.warn('토큰 필드 확인:', response.data.token); 
      console.warn('사용자 이름:', response.data.name);
      console.warn('사용자 ID:', response.data.userId);
      
      // 토큰이 있는지 확인
      if (!response.data.token) {
        console.error('토큰이 응답에 없음!');
        return rejectWithValue('토큰을 받지 못했습니다.');
      }
      
      // 토큰 저장
      tokenUtils.setToken(response.data.token);
      console.warn('토큰 저장 완료');
      
      // 저장된 토큰 재확인
      const savedToken = tokenUtils.getToken();
      console.warn('저장된 토큰 확인:', savedToken);
      
      return response.data;
    } catch (error: unknown) {
      console.error('로그인 에러 상세:', error);
      
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('에러 응답:', axiosError.response?.data);
      console.error('에러 상태:', axiosError.response?.status);
      
      const errorMessage = axiosError.response?.data?.message || axiosError.message || '로그인에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  },
);

// 회원가입 비동기 액션
export const registerAsync = createAsyncThunk<
  RegisterResponse['data'],
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (registerData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await registerUser(registerData);
      
      // 회원가입 후 자동 로그인되므로 토큰 저장
      tokenUtils.setToken(response.data.token); 
      
      return response.data; 
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || '회원가입에 실패했습니다.';
      return rejectWithValue(errorMessage);
    }
  }
);
// 로그아웃 비동기 액션
export const logoutAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();

      // 토큰 제거
      tokenUtils.removeToken();
    } catch (error: unknown) {
      // 로그아웃은 에러가 나도 로컬 토큰 제거
      tokenUtils.removeToken();
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '로그아웃 처리 중 오류가 발생했습니다.';
      return rejectWithValue(errorMessage);
    }
  },
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },

    // 토큰 수동 설정
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        tokenUtils.setToken(action.payload);
      } else {
        tokenUtils.removeToken();
      }
    },

    // 즉시 로그아웃 (동기)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      tokenUtils.removeToken();
    },

    // 사용자 정보 업데이트
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },

  // 비동기 액션 처리
  extraReducers: (builder) => {
    // 로그인 액션 처리
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // User 객체 생성
        state.user = {
          id: action.payload.userId,
          name: action.payload.name,
          email: '', // API에서 제공하지 않으므로 빈 값
        } as User;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload || '로그인에 실패했습니다.';
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });

    // 회원가입 액션 처리
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isRegisterLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // User 객체 생성
        state.user = {
          id: action.payload.userId,
          name: action.payload.name,
          email: '', // 필요시 registerData에서 가져오기
        } as User;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = action.payload || '회원가입에 실패했습니다.';
      });

    // 로그아웃 액션 처리
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLogoutLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLogoutLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLogoutLoading = false;
        state.error = action.payload || '로그아웃 처리 중 오류가 발생했습니다.';

        // 에러가 나도 로그아웃 처리
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export
export const { clearError, setToken, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

// 셀렉터들 (상태 조회용)
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoginLoading = (state: { auth: AuthState }) => state.auth.isLoginLoading;
export const selectIsRegisterLoading = (state: { auth: AuthState }) => state.auth.isRegisterLoading;
export const selectIsLogoutLoading = (state: { auth: AuthState }) => state.auth.isLogoutLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

/*
사용 방법:

import { useAppDispatch, useAppSelector } from '@hooks/useAppRedux';
import { loginAsync, selectUser, selectIsLoginLoading } from '@store/slices/authSlice';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoginLoading);
  
  const handleLogin = async () => {
    try {
      await dispatch(loginAsync(loginData)).unwrap();
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };
}
*/
