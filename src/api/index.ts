import http, { POST, DELETE } from './http';

/**
 * 登录
 * @param data
 */
export const login = (data: object) => http({ url: `/token`, method: POST, data });

/**
 * 退出
 * @param data
 */
export const logout = () => http({ url: '/token', method: DELETE });


