import API from '../utils/API/API';

const DashboardService = {
    getDashboardStats: () =>
        API.get('/admin/dashboard/stats'),
    getRevenue: (view: 'daily' | 'hourly') => API.get(`/admin/dashboard/revenue`, {params: {view}}),
    getPeakHours: () => API.get('/admin/dashboard/peak-hours'),
    getSpotUsage: () => API.get('/admin/dashboard/spot-usage'),
    getOccupancyTrend: () => API.get('/admin/dashboard/occupancy-trend'),
};

export default DashboardService;