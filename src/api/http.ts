import { baseURL, TOKEN_LOSE } from '@/project.config';
import Taro from '@tarojs/taro';
import HOST from './api.config';
import codeMsg from './code';

/**
 * 请求数据的方法
 */
async function http<T = any> ({ url, method = GET, data }: {url: string, method?: HttpMethod, data? : any}): Promise<T> {
  let options = {
    timeout: 1000 * 10,
    header: {
        common: {
            'Authorization': 'zhangchuwang'
        },
        post: {'Content-Type': 'application/x-www-form-urlencoded'},
        token: Taro.getStorageSync('token') || ''
    },
    url: `${HOST}${baseURL}${url}`,
    data,
    method
  };
  const res = await Taro.request(options);
  const { code } = res.data;
  if (code === 0) {
    return Promise.resolve(res.data.data);
  }
  // token 过期
  if (TOKEN_LOSE.indexOf(code) > -1) {
    // TODO 跳转到登录
    Taro.showToast({
      icon: 'none',
      title: '登录失效，请重新登录'
    });
    Taro.removeStorageSync('token');
    Taro.removeStorageSync('SESSION');
    Taro.navigateTo({
      url: '/pages/login/index'
    });
  }
  let title: string = res.data.message;
  title = codeMsg[code] || '系统异常，请重试';
  // 普通的提示
  if (code < 1010 && code > 0) {
    Taro.showToast({
      icon: 'none',
      title
    });
  }
  // 网络错误
  if (code === 0) {
    Taro.showToast({
      icon: 'none',
      title: '网络异常，请检查网络设置后重试！'
    });
  }
  // 请求超时
  if (code === 'ECONNABORTED') {
    Taro.showToast({
      icon: 'none',
      title: '加载数据失败，请重新请求！'
    });
  }
  if (code >= 2000) {
    Taro.showModal({
      title: '温馨提示',
      content: res.data.message
    });
  }
  if (!res.data.message) {
    Taro.showModal({
      title: '',
      content: '系统繁忙，请稍后再试！'
    });
  }
  return Promise.reject(res.data);
};

/**
 * 集合方法
 * @param url
 * @returns
 */
function _resource (url: string) {
  return {
    get <T = any>(id: string | number): Promise<T> {
      return http({
        method: GET,
        url: [url, id].join('/'),
        data: null
      });
    },
    list <T = any>(data: object): Promise<T> {
      return http({
        url: url,
        method: GET,
        data
      });
    },
    edit <T = any>({ id, ...data }: {id: string | number}): Promise<T> {
      return http({
        method: PUT,
        url: [url, id].join('/'),
        data
      });
    },
    add <T = any>(data: object): Promise<T> {
      return http({
        method: POST,
        url: url,
        data
      });
    },
    delete <T = any>({ id, ...data }: {id: string | number}): Promise<T> {
      return http({
        method: DELETE,
        url: [url, id].join('/'),
        data
      });
    }
  };
};
// 小程序不支持PATCH类型接口
enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}
export default http;
export const resource = _resource;
export const GET: HttpMethod = HttpMethod.GET;
export const POST: HttpMethod = HttpMethod.POST;
export const PUT: HttpMethod = HttpMethod.PUT;
export const DELETE: HttpMethod = HttpMethod.DELETE;
