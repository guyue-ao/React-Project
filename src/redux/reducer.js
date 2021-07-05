
import {INCREMENT,DECREMENT} from './acton_types'


let initState=0//设置初始化状态

export default function operaCount(preState=initState,action) {
  
  // 根据action的type 和data 决定怎样操作
  const {type,data}=action;
 let newState
  switch (type) {
    case INCREMENT:
        newState=data+preState
        console.log(newState)
        return newState
    case DECREMENT:
      newState=preState-data
      console.log(newState)
      return newState
  

    default:
      return preState;
  }

  
}