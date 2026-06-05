import API from '../utils/API/API';

const ParkingSessionService = {
    getUserActiveSession: async () => {
        const response = await API.get('/parking-sessions/active');
        return response?.data?.data ?? response?.data;
    },
    reserveSpot: async (spotId: string, cardId: string) => {
        const response = await API.post('/parking-sessions/reserve', {spotId, cardId});
        return response?.data?.data ?? response?.data;
    },
    getAdminActiveSessions: async ({page = 1, pageSize = 10, qs = "", sortBy, sortOrder}: {
        page: number;
        pageSize: number;
        qs: string;
        sortBy?: string;
        sortOrder?: "ASC" | "DESC";
    }) => {
        return await API.get("/parking-sessions/all/active", {
            params: {
                page,
                pageSize,
                qs,
                sortBy,
                sortOrder,
            },
        });
    },
    endSession: async (sessionId: string) => {
        const response = await API.post(`/parking-sessions/${sessionId}/end`);
        return response?.data?.data ?? response?.data;
    },

    getSessionHistory: async () => {
        const response = await API.get('/parking-sessions/history');
        return response?.data?.data ?? response?.data ?? [];
    },

    getPriceMetrics: async () => {
        const response = await API.get('/parking-sessions/price-metrics');
        return response?.data?.data ?? response?.data ?? [];
    }
};

export default ParkingSessionService;