import API from '../utils/API/API';

const ParkingLotService = {
    create: (data: {
        name: string;
        location: string;
        capacity: number;
    }) => API.post('/parking-lots', data),

    findAll: () =>
        API.get('/parking-lots'),
};

export default ParkingLotService;