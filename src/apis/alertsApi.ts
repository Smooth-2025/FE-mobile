import api from '@/apis';

export type AlertRenderedRequest = {
  type: 'accident-nearby' | 'obstacle';
  renderedAtMs: number;
};

export type AlertRenderedResponse = {
  data: {
    reportId: string;
  };
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
