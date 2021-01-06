import http, { GET } from '../http';

const base = '/users';

export const userOverview = (data: any) => http({url: `${base}/overview`, method: GET, data});
