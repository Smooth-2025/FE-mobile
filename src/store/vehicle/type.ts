//차량 정보
export type VehicleInfo = {
  userId: number;
  userName: string;
  vehicleId: number;
  plateNumber: string;
  imei: string;
  linkedAt: string;
};

//차량 연동 상태
export type LinkStatus = {
  linked: boolean;
  vehicle: VehicleInfo | null;
};

export type LinkVehicleReq = { plateNumber: string; imei: string };
export type BackendError = { success: false; code: number; message: string; data: unknown };
