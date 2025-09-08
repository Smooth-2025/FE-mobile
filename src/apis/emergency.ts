import api from './index';
import type {
  EmergencyRequestDto,
  EmergencyDecisionResponse,
  EmergencyHistoryResponse,
} from '@/types/api';

export const sendEmergencyDecision = async (
  data: EmergencyRequestDto,
): Promise<EmergencyDecisionResponse> => {
  return await api.post('/api/drivecast/emergency/decision', data);
};

export const getEmergencyHistory = async (): Promise<EmergencyHistoryResponse> => {
  return await api.get('/api/drivecast/emergency/history');
};
