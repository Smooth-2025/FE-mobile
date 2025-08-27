import { useState } from 'react';
import { sendEmergencyDecision } from '@/apis/emergency';
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
      
      await sendEmergencyDecision(requestData);
      
      setIsEmergencyModalOpen(false);
      setIsReportedModalOpen(true);
      setIsTimeout(timeout);
    } catch (error) {
      console.error('Emergency call failed:', error);
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