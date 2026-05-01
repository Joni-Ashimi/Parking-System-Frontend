import API from '../utils/API/API';

const VehicleService = {
    create: (plateNumber: string, type: string, userId: string) =>
        API.post('/vehicles', {plateNumber, type, userId}),
    getMyVehicles: () => API.get('/vehicles/my-vehicles'),
    delete: (id: string) =>
        API.delete(`/vehicles/${id}`),
    markAsDefault: (id: string) => API.patch(`/vehicles/${id}/default`),
    getById: (id: string) => API.get(`/vehicles/${id}`),
};

export default VehicleService;