import api from './index';
import type { EmergencyRequestDto, EmergencyDecisionResponse } from '@/types/api';

export const sendEmergencyDecision = async (data: EmergencyRequestDto): Promise<EmergencyDecisionResponse> => {
  return await api.post('/api/drivecast/emergency/decision', data);}
