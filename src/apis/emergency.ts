import drivecastApi from './drivecast';
import type { 
  EmergencyRequestDto, 
  EmergencyDecisionResponse, 
  EmergencyHistoryResponse 
} from '@/types/api';

export const sendEmergencyDecision = async (data: EmergencyRequestDto): Promise<EmergencyDecisionResponse> => {
  return await drivecastApi.post('/api/drivecast/emergency/decision', data);
};

export const getEmergencyHistory = async (): Promise<EmergencyHistoryResponse> => {
  return await drivecastApi.get('/api/drivecast/emergency/history');
};
