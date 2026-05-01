import API from '../utils/API/API';

const ParkingLotService = {
    create: (data: {
        name: string;
        location: string;
        capacity: number;
    }) => API.post('/parking-lots', data),

    findAll: () =>
        API.get('/parking-lots'),

    findOne: (id: string) =>
        API.get(`/parking-lots/${id}`),

    update: (id: string, data: any) =>
        API.patch(`/parking-lots/${id}`, data),

    remove: (id: string) =>
        API.delete(`/parking-lots/${id}`),

    assignSpot: (lotId: string, spotId: string) =>
        API.post(`/parking-lots/${lotId}/spots/${spotId}`),

    getStats: (lotId: string) =>
        API.get(`/parking-lots/${lotId}/stats`),
};

export default ParkingLotService;