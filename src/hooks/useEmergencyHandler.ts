import { useState } from 'react';
import { AxiosError } from 'axios';
import { sendEmergencyDecision } from '@/apis/emergency';
import { tokenUtils } from '@/utils/token';
import type { EmergencyRequestDto } from '@/types/api';


export const useEmergencyHandler = () => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isReportedModalOpen, setIsReportedModalOpen] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [currentAccidentId, setCurrentAccidentId] = useState<string>('');

  const openEmergencyModal = (accidentId: string) => {
    setCurrentAccidentId(accidentId);
    setIsEmergencyModalOpen(true);
  };

  const handleEmergencyCall = async (timeout: boolean) => {
    try {
      const requestData: EmergencyRequestDto = {
        accidentId: currentAccidentId,
        chooseReport: true,
        timeout: timeout,
      };

      console.warn('Emergency request data:', requestData);
      console.warn('Current token:', tokenUtils.getToken());
      console.warn('Has token:', tokenUtils.hasToken());

      await sendEmergencyDecision(requestData);

      setIsEmergencyModalOpen(false);
      setIsReportedModalOpen(true);
      setIsTimeout(timeout);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Emergency call failed:", error);

          if (error.response?.status === 503) {
            console.error("서비스 일시 중단 - 백엔드 서버 상태를 확인하세요");
          }
      } else {
          console.error("알 수 없는 오류:", error);
        }
      }
  };

  const handleManualEmergencyCall = () => {
    handleEmergencyCall(false);
  };

  const handleTimeoutEmergencyCall = () => {
    handleEmergencyCall(true);
  };

  const handleEmergencyModalClose = () => {
    setIsEmergencyModalOpen(false);
  };

  const handleReportedModalClose = () => {
    setIsReportedModalOpen(false);
  };

  return {
    isEmergencyModalOpen,
    isReportedModalOpen,
    isTimeout,
    openEmergencyModal,
    handleManualEmergencyCall,
    handleTimeoutEmergencyCall,
    handleEmergencyModalClose,
    handleReportedModalClose,
  };
};
