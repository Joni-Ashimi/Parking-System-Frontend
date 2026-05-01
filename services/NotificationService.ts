import API from '../utils/API/API';

const NotificationService = {
    getUnreadNotification: async (userId: string) => {
        const response = await API.get(`/notifications/${userId}/unread`);
        return response?.data?.data;
    },
    markAsRead: (notificationId: string) => {
        return API.patch(`/notifications/${notificationId}/read`);
    }
};

export default NotificationService;