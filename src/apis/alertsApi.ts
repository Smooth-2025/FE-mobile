import api from '@/apis';

export type AlertRenderedRequest = {
  type: 'accident-nearby' | 'obstacle';
  renderedAtMs: number;
};

export type AlertRenderedResponse = {
  success: boolean;
};

export const postAlertRendered = async (
  alertId: string,
  data: AlertRenderedRequest,
): Promise<AlertRenderedResponse> => {
  return await api.post(
    `/api/driving-analysis/reports/accident-reaction/alerts/${alertId}/rendered`,
    data,
  );
};
