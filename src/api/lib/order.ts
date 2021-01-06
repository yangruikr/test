import http, { POST, resource } from '../http';

const base = '/orders';

export const { list, get } = resource(base);

/**
 * 订单支付接口
 * @param data
 */
export const payment = (data: object) => http({ url: `${base}/payment`, method: POST, data});
