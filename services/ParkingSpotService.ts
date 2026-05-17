import API from '../utils/API/API';

export const ParkingSpotStatus = ['available', 'occupied', 'maintenance', 'reserved'] as const;
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

    findAvailable: (lotId?: string) =>
        API.get('/parking-spots/available', {
            params: {lotId},
        }),

    findOne: (id: string) =>
        API.get(`/parking-spots/${id}`),

    update: (id: string, data: Partial<ParkingSpotPayload>) => API.patch(`/parking-spots/${id}`, data),

    updateStatus: (id: string, status: ParkingSpotStatusType) =>
        API.patch(`/parking-spots/${id}/status`, {status}),

    remove: (id: string) =>
        API.delete(`/parking-spots/${id}`),
};

export default ParkingSpotService;