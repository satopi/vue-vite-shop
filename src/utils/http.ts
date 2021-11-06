import axios, { AxiosRequestConfig } from 'axios';
import { ElLoading, ILoadingInstance, ElMessageBox } from 'element-plus';
import { formatDate } from '@/utils/tools';

// 是否显示加载等待
let isLoading = true;
// 创建Axios实例
const request = axios.create({
  // 请求url = baseUrl + requestUrl
  baseURL: '/api',
  // 请求超时时间（毫秒）
  timeout: 200000
});

let loading: ILoadingInstance;

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if (isLoading)
      loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        // spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    if (isLoading) loading.close();
    formatDate(response.data);
    if (response.status === 200) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  (error) => {
    if (isLoading) loading.close();
    ElMessageBox.alert(error.response.data, '错误', {
      confirmButtonText: '确定',
      type: 'error'
    });
    return Promise.reject(error);
  }
);

// post请求
export const axiosPost = async (url: string, params: any = {}, loading = true, config?: AxiosRequestConfig): Promise<any> => {
  if (!loading) isLoading = false;
  const res = await request.post(url, params, config);
  return res;
};
