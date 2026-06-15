import API from '../utils/API/API';

export interface CreateOfferPayload {
    name: string;
    adjustmentType: "DISCOUNT" | "SURCHARGE";
    value: number;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    spotCategoryId: string;
}

export interface UpdateRatesPayload {
    hourlyRate: number;
    dailyRate: number;
}

const PricingService = {
    getDashboardData: () => API.get('/spot-categories/dashboard').then(res => res.data),

    updateCategoryRates: (id: string, data: UpdateRatesPayload) => API.put(`/spot-categories/${id}`, data).then(res => res.data),

    getSpecialOffers: () => API.get('/offers').then(res => res.data),

    createSpecialOffer: (data: CreateOfferPayload) =>
        API.post('/offers', data).then(res => res.data),

    deleteSpecialOffer: (id: string) => API.delete(`/offers/${id}`),
};

export default PricingService;