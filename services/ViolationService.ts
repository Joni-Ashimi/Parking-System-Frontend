import API from "../utils/API/API";

interface GetViolationsParams {
    page?: number;
    pageSize?: number;
    qs?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    status?: string;
    type?: string | string[];
}

const ViolationService = {
    getAll: (params: GetViolationsParams) => {
        const p: Record<string, any> = {
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 10,
        };
        if (params.qs) p.qs = params.qs;
        if (params.sortBy) p.sortBy = params.sortBy;
        if (params.sortOrder) p.sortOrder = params.sortOrder;
        if (params.status) p.status = params.status;
        if (params.type) {
            p.type = Array.isArray(params.type) ? params.type.join(",") : params.type;
        }
        return API.get("/violations", { params: p });
    },

    getStats: () => API.get("/violations/stats"),
};

export default ViolationService;