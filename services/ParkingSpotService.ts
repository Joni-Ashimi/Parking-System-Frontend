import API from '../utils/API/API';

export const ParkingSpotStatus = ['available', 'occupied', 'maintenance'] as const;
export type ParkingSpotStatusType = (typeof ParkingSpotStatus)[number];

export interface ParkingSpotPayload {
    spotNumber: string;
    floor: number;
    lotId: string;
    typeId: string;
    status: ParkingSpotStatusType;
}

const ParkingSpotService = {
    create: (data: ParkingSpotPayload) => API.post('/parking-spots', data),

    findAll: (params?: { lotId?: string; page?: number; pageSize?: number; qs?: string }) =>
        API.get('/parking-spots', {params}),

    findAllUserMap: () => API.get('/parking-spots/map-layout'),

    getStats: () => API.get(`/parking-spots/stats`),

    updateStatus: (id: string, status: ParkingSpotStatusType) =>
        API.patch(`/parking-spots/${id}/status`, {status}),

    remove: (id: string) =>
        API.delete(`/parking-spots/${id}`),
};

export default ParkingSpotService;