import myAxios from './myAxios'
import jsonp from 'jsonp'
import {message} from 'antd'
// import qs from 'querystring'
import { BASE_URL,WEATHER_AK,CITY } from '../config'

//项目中所有的请求都在这里

//登录请求
export const reqLogin=(username,password)=>{
  //axios 的post请i去默认将参数转成json进而发送给服务器
  return myAxios.post(`${BASE_URL}/login`,{username,password})
}
//获取商品列表的请求
export const reqCategoryList=()=>{
  return myAxios.get(`${BASE_URL}/manage/category/list`)
}

//获取天气信息（百度接口）
export const reqWeather=()=>{
  return new Promise((resolve,reject)=>{
    return jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`,(err,data)=>{
      // console.log(err,data)
      if(err){
          message.error('请求失败')
          return new Promise(()=>{})
      }else{
          
      }
  })
  })

}

//新增商品的分类
export const reqAddCategory=({categoryName})=>{
return  myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName:categoryName})
}

//更新商品的分类
export const reqUpdateCategory=({categoryId,categoryName})=>{
  return myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})

}

//请求商品的分页列表
export const reqProductList=(pageNum,pageSize)=>{
  return myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
}

//请求更新商品在售状态
export const reqUpdateProdStatus=(productId,status)=>{
  return myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
}
//搜索商品
export const reqSearchProduct=(pageNum,pageSize,searchType, keyWord)=>{


  return myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]: keyWord}})
}
//根据商品id获取商品信息
export const reqProdById=(productId)=>{


  return myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
}

//根据图片唯一名删除图片
export const reqDeletePicture=(name)=>{
  return myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
}

//请求添加商品
export const reqAddProduct=(productObj)=>{
  return myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj})
}

//请求更新商品
export const reqUpdateProduct=(productObj)=>{
  return myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj})
}
//请求所有角色列表
export const reqRoleList=()=>{
  return myAxios.get(`${BASE_URL}/manage/role/list`)
}
//请求添加角色
export const reqAddRole=({roleName})=>{
  return myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})
}
//请求给角色授权
export const reqAuthRole=(roleObj)=>{
  return myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})
}
//请求获取所有用户列表和角色列表
export const reqUserList=()=>{
  return myAxios.get(`${BASE_URL}/manage/user/list`)
}
//请求添加用户
export const reqAddUser=(userObj)=>{
  return myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj})
}