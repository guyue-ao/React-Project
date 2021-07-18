import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import NProgress from 'nprogress'
import  'nprogress/nprogress.css' 
import store from '../redux/store.js'
import {createDeleteUserInfoAction} from '../redux/actions/login_action'
const instance=axios.create({
  timeout:4000,
});
//请求拦截器
instance.interceptors.request.use( (config)=> {
 NProgress.start()
//  从redux中获取之前所保存的token
  const {token}=store.getState().userInfo
  // console.log(token)
  // 在请求头中加入token用来校验身份
  if(token) config.headers.Authorization='atguigu_'+token;
 
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
  if(error.response.status===401){
    message.error('请重新登录',2)
    store.dispatch(createDeleteUserInfoAction())
  }else{
    message.error(error.message,1)
  }
  
  return new Promise(()=>{});
});
export default instance