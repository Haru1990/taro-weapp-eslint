import Taro from '@tarojs/taro';

const IS_DEV = process.env.NODE_ENV === 'development';
// const mockURL = 'http://gz-cvm-ebuild-ningzhang-dev001.gz.sftcwl.com:7300/mock/5d8c351fcf2aa0138ad5ba55/sfdriver';
const devURL = 'http://10.188.60.86:8332';
// const devURL = 'http://10.188.40.56:8066';
// const prodURL = 'http://10.188.60.86:8332'; // 测试环境
const prodURL = 'http://uat-cview.sftcwl.com.cn'; // UAT 环境
const baseURL = IS_DEV ? devURL : prodURL;

interface IOption {
  method?: string;
  url: string;
  data: object;
}

export default function request(option: IOption) {
  // const cookie: string = `cv_lang=${Taro.getStorageSync('locale')};`;
  // const reqTime: string = new Date().toISOString();
  const requestOption: any = {
    url: `${baseURL}${option.url}`,
    method: option.method || 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Cookie': cookie,
    },
    data: {
      ...option.data,
      // req_time: reqTime,
    },
  };
  return new Promise((resolve, reject) => {
    Taro.request(requestOption)
      .then((res: any) => {
        const {statusCode, data} = res;
        if (statusCode >= 200 && statusCode < 300) {
          if (data.errno === 0 || data.errno === '0') {
            resolve(data.data);
          } else {
            Taro.showToast({
              title: `${data.errmsg}～${data.errno}`,
              icon: 'none',
              mask: true,
            });
          }
        } else {
          reject(`网络请求错误，状态码${statusCode}`);
          throw new Error(`网络请求错误，状态码${statusCode}`);
        }
      })
      .catch(() => {
        Taro.showToast({
          title: '网络请求错误',
          icon: 'none',
          mask: true,
        });
      });
  });
}
