let HOST: string;
if (process.env.NODE_ENV === 'development') { // 开发
    HOST = 'https://sm.zhangchuwang.cn';
} else { // 正式
    HOST = 'https://mall.zhangchuwang.cn';
}

export default HOST;
