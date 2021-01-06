import http, { GET, POST } from '../http';

const base = '/wx';

export const code2Session = (data: object) => http({ url: `${base}/code2Session`, method: GET, data});

/**
 * 一键登录
 * @param data
 */
export const wxLogin = (data: object) => http({ url: `${base}/mini/login`, method: POST, data});
