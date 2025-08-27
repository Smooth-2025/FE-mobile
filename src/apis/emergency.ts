import drivecastApi from './drivecast';
import type { EmergencyRequestDto, EmergencyDecisionResponse } from '@/types/api';

export const sendEmergencyDecision = async (data: EmergencyRequestDto): Promise<EmergencyDecisionResponse> => {
  return await drivecastApi.post('/api/drivecast/emergency/decision', data);
};
