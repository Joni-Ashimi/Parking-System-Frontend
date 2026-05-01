import API from '../utils/API/API';

const ParkingSpotStatus = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'] as const;
const ParkingSpotService = {
    create: (data: {
        spotNumber: string;
        floor: number;
        lotId: string;
        status: typeof ParkingSpotStatus[number];
    }) => API.post('/parking-spots', data),

    findAll: (lotId?: string) =>
        API.get('/parking-spots', {
            params: {lotId},
        }),

    findAvailable: (lotId?: string) =>
        API.get('/parking-spots/available', {
            params: {lotId},
        }),

    findOne: (id: string) =>
        API.get(`/parking-spots/${id}`),

    update: (id: string, data: any) =>
        API.patch(`/parking-spots/${id}`, data),

    updateStatus: (id: string, status: typeof ParkingSpotStatus[number]) =>
        API.patch(`/parking-spots/${id}/status`, {status}),

    remove: (id: string) =>
        API.delete(`/parking-spots/${id}`),
};

export default ParkingSpotService;