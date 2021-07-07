import myAxios from './myAxios'
// import qs from 'querystring'
import { BASE_URL } from '../config'

//项目中所有的请求都在这里

//登录请求
export const reqLogin=(username,password)=>{
  //axios 的post请i去默认将参数转成json进而发送给服务器
  return myAxios.post(`${BASE_URL}/login`,{username,password})
       
   
}