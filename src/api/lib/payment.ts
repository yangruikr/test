import http, { POST } from '../http';

const base = '/payments';

export const payments = (data: object) => http({ url: `${base}`, method: POST, data});

export const paymentsPayInfo = (data: object) => http({ url: `${base}/payInfo`, method: POST, data});
