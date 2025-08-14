import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SignupState, SignupStep, ProfileFormData, AgreementState, EmergencyData } from '@/types/api';

const initialState: SignupState = {
  currentStep: 'email',
  email: '',
  isEmailVerified: false,
  profileFormData: null,
  agreementState: null,
  emergencyData: null,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    // 단계 이동
    setStep: (state, action: PayloadAction<SignupStep>) => {
      state.currentStep = action.payload;
    },
    
    // 이메일 설정
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    
    // 이메일 인증 완료
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },
    
    // 필수정보 저장
    setProfileData: (state, action: PayloadAction<ProfileFormData>) => {
      state.profileFormData = action.payload;
    },
    
    // 약관동의 저장
    setTermsData: (state, action: PayloadAction<AgreementState>) => {
      state.agreementState = action.payload;
    },
    
    // 응급정보 저장
    setEmergencyData: (state, action: PayloadAction<EmergencyData>) => {
      state.emergencyData = action.payload;
    },
    
    // 초기화
    resetSignup: () => initialState,
  },
});

export const {
  setStep,
  setEmail,
  setEmailVerified,
  setProfileData,
  setTermsData,
  setEmergencyData,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;

// 셀렉터들
export const selectSignupState = (state: { signup: SignupState }) => state.signup;
export const selectCurrentStep = (state: { signup: SignupState }) => state.signup.currentStep;
export const selectSignupEmail = (state: { signup: SignupState }) => state.signup.email;
export const selectIsEmailVerified = (state: { signup: SignupState }) => state.signup.isEmailVerified;