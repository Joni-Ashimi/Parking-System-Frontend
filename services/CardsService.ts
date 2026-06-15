import API from '@/utils/API/API';

const CardsService = {
    listUserCards: async () => {
        const response = await API.get("/cards/list-cards");
        return response?.data
    },
    tokenizeGuestCard: async (payload: {
        csFlexCard: { jwe: string; expirationMonth?: string; expirationYear?: string };
        securityCode: string;
        billingInfo?: object;
    }) => {
        const response = await API.post("/cards/tokenize-guest-card", payload);
        return response?.data;
    },
    setDefaultCard: async (cardId: string) => {
        const response = await API.post("/cards/set-default", {cardId});
        return response?.data;
    },

    saveCard: (cardPayload: any) => API.post('/cards/save', {cardPayload}),
}

export default CardsService;