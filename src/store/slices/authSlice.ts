import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, deleteAccount } from '@apis/auth';
import { tokenUtils } from '@/utils/token';
import type { PayloadAction } from '@reduxjs/toolkit';
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
  accessToken: string | null;
  // 로딩 상태들
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isLogoutLoading: boolean;
  isDeleteAccountLoading: boolean;
  // 에러 상태
  error: string | null;
  // 인증 여부
  isAuthenticated: boolean;

   signupCurrentStep: 1 | 2 | 3 | 4;
}

// 초기 상태
const initialState: AuthState = {
  user: null,
  accessToken: tokenUtils.getAccessToken(), // 페이지 새로고침시 토큰 복원
  isLoginLoading: false,
  isRegisterLoading: false,
  isLogoutLoading: false,
  isDeleteAccountLoading: false,
  error: null,
  isAuthenticated: !!tokenUtils.getAccessToken(),
  signupCurrentStep: 1,
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
      const response = await loginUser(loginData);
      
      // 토큰이 있는지 확인
      if (!response.data.token) {
        return rejectWithValue('토큰을 받지 못했습니다.');
      }
      
      // 토큰 저장
      tokenUtils.setToken(response.data.token);
      
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      
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

// 회원탈퇴 비동기 액션
export const deleteAccountAsync = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccount();
      tokenUtils.removeToken();
    } catch (error: unknown) {
      tokenUtils.removeToken(); // 에러가 나도 로컬 토큰 제거
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '회원탈퇴 처리 중 오류가 발생했습니다.';
      return rejectWithValue(errorMessage);
    }
  },
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },


    // 회원가입 스텝 관리
    setSignupStep: (state, action: PayloadAction<1 | 2 | 3 | 4>) => {
      state.signupCurrentStep = action.payload;
    },
    
    nextSignupStep: (state) => {
      if (state.signupCurrentStep < 4) {
        state.signupCurrentStep = (state.signupCurrentStep + 1) as 1 | 2 | 3 | 4;
      }
    },
    
    prevSignupStep: (state) => {
      if (state.signupCurrentStep > 1) {
        state.signupCurrentStep = (state.signupCurrentStep - 1) as 1 | 2 | 3 | 4;
      }
    },
    
    resetSignupStep: (state) => {
      state.signupCurrentStep = 1;
    },
    
    // 로그아웃시 상태 초기화
    resetAuthState: (state) => {
      tokenUtils.removeToken();
      // immer를 사용해서 상태 초기화
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.signupCurrentStep = 1;
      state.isLoginLoading = false;
      state.isRegisterLoading = false;
      state.isLogoutLoading = false;
      state.isDeleteAccountLoading = false;
    },

    // Access Token 설정
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        tokenUtils.setAccessToken(action.payload);
      } else {
        tokenUtils.removeAccessToken();
      }
    },

    // 즉시 로그아웃 (동기)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      tokenUtils.clearAllTokens();
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
    // 로그인 성공 처리
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.accessToken = action.payload.token; // (백엔드 응답)
        state.isAuthenticated = true;

        state.user = {
          id: action.payload.userId,
          name: action.payload.name,
          email: '',
        } as User;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload || '로그인에 실패했습니다.';
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
      });

    // 회원가입 액션 처리
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.isRegisterLoading = false;
        // 회원가입 후에는 인증 상태로 만들지 않음
        state.accessToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.signupCurrentStep = 1;
        // 회원가입 성공 시 에러 상태만 초기화
        state.error = null;
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
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLogoutLoading = false;
        state.error = action.payload || '로그아웃 처리 중 오류가 발생했습니다.';

        // 에러가 나도 로그아웃 처리
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

      // 회원탈퇴 액션 처리
    builder
      .addCase(deleteAccountAsync.pending, (state) => {
        state.isDeleteAccountLoading = true;
      })
      .addCase(deleteAccountAsync.fulfilled, (state) => {
        state.isDeleteAccountLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.isDeleteAccountLoading = false;
        state.error = action.payload || '회원탈퇴 처리 중 오류가 발생했습니다.';
        // 에러가 나도 로그아웃 처리
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

// Export
export const { clearError, setAccessToken, logout, updateUser,   setSignupStep, 
  nextSignupStep, 
  prevSignupStep, 
  resetSignupStep,
  resetAuthState } = authSlice.actions;

export const selectSignupCurrentStep = (state: { auth: AuthState }) => state.auth.signupCurrentStep;
export default authSlice.reducer;

// 셀렉터들 (상태 조회용)
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoginLoading = (state: { auth: AuthState }) => state.auth.isLoginLoading;
export const selectIsRegisterLoading = (state: { auth: AuthState }) => state.auth.isRegisterLoading;
export const selectIsLogoutLoading = (state: { auth: AuthState }) => state.auth.isLogoutLoading;
export const selectIsDeleteAccountLoading = (state: { auth: AuthState }) => state.auth.isDeleteAccountLoading;
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