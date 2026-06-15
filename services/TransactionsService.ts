import API from '../utils/API/API';
import {PayerAuthentication} from '@nebula-ltd/pok-payments-js';

const TransactionsService = {
    prepare3DS: async (sdkOrderId: string, cardId: string): Promise<PayerAuthentication> => {
        const response = await API.post('/transactions/prepare-3ds', {sdkOrderId, cardId});
        return response?.data?.data ?? response?.data;
    },

    finalize: async (sdkOrderId: string) => {
        const response = await API.post('/transactions/finalize', {sdkOrderId});
        return response?.data?.data ?? response?.data;
    },
};

export default TransactionsService;