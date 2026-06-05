import API from '@/utils/API/API';
import {AddCardData} from '@nebula-ltd/pok-payments-js';

interface SetUpTokenized3DSPayload {
    selectedCardId?: string,
    sdkOrderId?: string
}

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
    setupTokenized3DS: async (payload: SetUpTokenized3DSPayload) => {
        const response = await API.post("/cards/setup-tokenized-3DS", payload);
        return response?.data;
    },
    setDefaultCard: async (cardId: string) => {
        const response = await API.post("/cards/set-default", {cardId});
        return response?.data;
    },
    getGuestCardInfo: async (cardId: string[]) => {
        const response = await API.post("/cards/get-guest-card-info", {cardId});
        return response?.data;
    },

    saveCard: (cardPayload: any) => API.post('/cards/save', {cardPayload}),
}

export default CardsService;