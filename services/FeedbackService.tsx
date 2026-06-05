import API from '../utils/API/API';

interface FeedbackPayload {
    subject: string;
    category: string;
    message: string;
    photos?: File[];
}

const FeedBackService = {
    submitFeedback: (data: FeedbackPayload) => {
        if (data.photos && data.photos.length > 0) {
            const formData = new FormData();
            formData.append('subject', data.subject);
            formData.append('category', data.category);
            formData.append('message', data.message);

            data.photos.forEach((photo) => {
                formData.append('photos', photo);
            });

            return API.post('/feedback', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });
        }

        return API.post('/feedback', {
            subject: data.subject,
            category: data.category,
            message: data.message,
        });
    },
    getAll: (params: { page: number; pageSize: number; qs?: string; sortBy?: string; sortOrder?: string }) => {
        return API.get('/feedback', {params});
    },
    updateStatus: (id: string, status: string) => {
        return API.patch(`/feedback/${id}/status`, {status});
    }
};

export default FeedBackService;