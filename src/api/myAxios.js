import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import NProgress from 'nprogress'
import  'nprogress/nprogress.css' 
const instance=axios.create({
  timeout:4000,
});
//请求拦截器
instance.interceptors.request.use( (config)=> {
 NProgress.start()
  const {method,data}=config;
  //若是post请求
  if(method.toLocaleLowerCase()==='post'){
    if(data instanceof Object){
      config.data=qs.stringify(data)
    }
  }

  return config;
});

//响应拦截器
instance.interceptors.response.use( 
  (response)=> {
    NProgress.done()
    // 请求若成功
  return response.data;
}, (error)=> {
  // 请求若失败
  NProgress.done()
  message.error(error.message,1)
  return new Promise(()=>{});
});
export default instance