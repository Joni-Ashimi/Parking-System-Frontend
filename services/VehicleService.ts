import API from '../utils/API/API';

const VehicleService = {
    create: (plateNumber: string, type: string, userId: string) =>
        API.post('/vehicles', { plateNumber, type, userId }),

    getAll: (userId?: string) =>
        API.get('/vehicles', {
            params: userId ? { userId } : {},
        }),

    getById: (id: string) =>
        API.get(`/vehicles/${id}`),

    update: (id: string, data: { plateNumber?: string; type?: string }) =>
        API.patch(`/vehicles/${id}`, data),

    delete: (id: string) =>
        API.delete(`/vehicles/${id}`),
};

export default VehicleService;