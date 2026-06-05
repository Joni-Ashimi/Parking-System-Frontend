import API from '../utils/API/API';
import {PayerAuthentication} from '@nebula-ltd/pok-payments-js';

export interface TransactionPayload {
    amount: number;
    sessionId: string;
    currency: 'ALL' | 'EUR';
}

const TransactionsService = {
    // GET /transactions/:id
    findOne: (id: string) => API.get(`/transactions/${id}`),

    // POST /transactions
    createTransaction: async (payload: TransactionPayload) => {
        const response = await API.post('/transactions', payload);
        return response?.data;
    },

    // POST /transactions/initiate
    initiateCheckout: (sessionId: string, amount: number, currency: 'ALL' | 'EUR' = 'ALL') =>
        API.post('/transactions/initiate', {sessionId, amount, currency}),

    // POST /transactions/prepare-3ds
    prepare3DS: async (sdkOrderId: string, cardId: string): Promise<PayerAuthentication> => {
        const response = await API.post('/transactions/prepare-3ds', {sdkOrderId, cardId});
        return response?.data?.data ?? response?.data;
    },
    // GET /transactions/session/:sessionId
    getTransactionForParkingSession: (sessionId: string) =>
        API.get(`/transactions/session/${sessionId}`),

    finalize: async (sdkOrderId: string) => {
        const response = await API.post('/transactions/finalize', {sdkOrderId});
        return response?.data?.data ?? response?.data;
    },
};

export default TransactionsService;