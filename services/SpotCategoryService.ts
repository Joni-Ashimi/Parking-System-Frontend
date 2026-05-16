import API from '../utils/API/API';

export const ParkingSpotTypeCode = [
    'MOTORCYCLE', 'COMPACT', 'STANDARD', 'LARGE', 'TRUCK', 'CAR', 'BUS', 'EV', 'ACCESSIBLE'
] as const;
export type SpotTypeCode = (typeof ParkingSpotTypeCode)[number];

export const SpotSize = ['SMALL', 'MEDIUM', 'LARGE'] as const;
export type SpotSizeType = (typeof SpotSize)[number];

interface SpotCategoryPayload {
    code: SpotTypeCode;
    name: string;
    size: SpotSizeType;
    baseHourlyRate: number;
    baseDailyRate: number;
}

const SpotCategoryService = {
    create: (data: SpotCategoryPayload) =>
        API.post('/spot-categories', data),

    findAll: () =>
        API.get('/spot-categories'),

    findOne: (id: string) =>
        API.get(`/spot-categories/${id}`),

    update: (id: string, data: Partial<SpotCategoryPayload>) =>
        API.patch(`/spot-categories/${id}`, data),

    remove: (id: string) =>
        API.delete(`/spot-categories/${id}`),
};

export default SpotCategoryService;