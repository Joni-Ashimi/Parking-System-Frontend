import API from '../utils/API/API';

const VehicleService = {
    create: (plateNumber: string, type: string, userId: string) =>
        API.post('/vehicles', {plateNumber, type, userId}),
    getMyVehicles: () => API.get('/vehicles/my-vehicles'),
    delete: (id: string) =>
        API.delete(`/vehicles/${id}`),
    markAsDefault: (id: string) => API.patch(`/vehicles/${id}/default`),
    getDefaultVehicle: async () => {
        const response = await API.get('/vehicles/default');
        return response?.data?.data ?? response?.data;
    },
};

export default VehicleService;