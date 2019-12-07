import Vue from 'vue'
import router from '../router/'
import axios from 'axios'

// 导入JSON-bigint
import JSONbig from 'json-bigint'

axios.defaults.transformResponse = [function (data) {
    try {
        return JSONbig.parse(data);
    } catch{
        return data;
    }
    // 对 data 进行任意转换处理

}],


    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么(成功响应调用)
        // window.console.log('响应成功',response)
        return response;
    }, function (error) {
        window.console.dir(error)
        // 对响应错误做点什么（响应出错调用）
        // window.console.dir(error)
        // return Promise.reject(error);
        if (error.response.status == 401) {

            //代表token有问题，要么就是还没登录，要么就是你伪造的token
            //那就打回登录页面
            Vue.prototype.$message.error('请先登录')
            router.push('/login')

        } else {

            // 原来该怎么报错还怎么报错
            return Promise.reject(error)
        }
    });




Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let obj = JSON.parse(window.localStorage.getItem('userInfo'))
    if (obj) {
        config.headers.Authorization = `Bearer ${obj.token}`
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});