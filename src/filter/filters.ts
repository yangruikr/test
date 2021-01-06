import * as d from '@/util/date';
import { qiniuUrl } from '@/project.config.ts';

/**
 * 格式化
 * @param { String, Number, Date } value
 * @param { String }formatString
 */
export const date = (value = new Date(), formatString: string = 'YYYY-MM-DD HH:mm') => d.format(new Date(value), formatString);

/**
 * 格式化货币
 * @param { String, Number } value
 * @param { String } format
 * @param { Number } fixed
 */
export const money = (value: string | number, format: string = '¥', fixed: number = 2) => format + (+value).toFixed(fixed).replace('.00', '');

/**
 * 格式化数字
 * @param { String, Number } value
 * @param { Number } fixed
 */
export const number = (value: string | number, fixed: number = 2) => (+value).toFixed(fixed).replace('.00', '');

/**
 * 指定字符串替换，格式化
 * @param {String} value
 * @param {String} old
 * @param {String} format
 * @returns {*}
 */
export const afternoon = (value: string, old: string = '13:00', format: string = '14:30-18:00'): any => {
    if (value === old) {
        return format;
    }
    return value;
};

/**
 * 空值处理
 * @param value
 * @param def
 */
export const trim = (value: string, def: any) => value.replace(/(^\s*)|(\s*$)/g, '') || def;

/**
 * abs
 * @param value
 * @param def
 */
export const abs = (value: number) => Math.abs(value) || value;

/**
 * 七牛
 * @param value
 * @param def
 */
export const qiniu = (value: string, def: string) => `${qiniuUrl}/${value}?${def}`;


const weekMap = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
};

/**
 * 星期汉化
 * @param value
 * @param def
 * @returns {*|string}
 */
export const weekDay = (value = ''): string => {
    if (value.split('-').length > 1) {
        value = value.replace(/-/ig, '/');
    }

    let day = new Date(value).getDay();
    return weekMap[day] || '';
};

/**
 * 用于id-value取值
 * @param value
 * @param arr
 * @param key
 * @param returnVal
 * @return {*}
 */
export const keyValue = (value: any, arr = [], key = 'id', returnVal = 'name'): any => {
    let matched = arr.find(item => item[key] === value);
    if (matched) {
        return matched[returnVal];
    }
    return '无';
};
