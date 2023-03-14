/**
 * /rows/:rowId/leave
 * /rows/:rowId
 * 
 * /shops/:shopId/rows/{custom action}
 * /shops/:shopId
 * /shops
 * 
 * /auth/login
 * /auth/signup
 * 
 * /profile
 */

const URL = process.env.STOP_ROW_API_URL || 'http://localhost:3001';

const endpoints = {
    rows: {
        leave: (rowId: string) => `${URL}/rows/${rowId}/leave`,
        join: (rowId: string) => `${URL}/rows/${rowId}/join`,
        get: (rowId: string) => `${URL}/rows/${rowId}`,
    },
    shops: {
        get: (shopId: string) => `${URL}/shops/${shopId}`,
        getShops: `${URL}/shops`,
        applyAction: (shopId: string, action: string | null) => `${URL}/shops/${shopId}/rows/${action}`,
        put: (shopId: string) => `${URL}/shops/${shopId}/rows`,
    },
    auth: {
        login: `${URL}/auth/login`,
        signup: `${URL}/auth/signup`,
        refresh: `${URL}/auth/refresh`,
    },
    profile: `${URL}/profile`,
};

export default endpoints;