import operaPerson from "./person_reducer";
import operaCount from "./reducer";
import {combineReducers} from 'redux'



//combineReducers 接收的一个对象作为参数
//对象中的key就是store中保存该状态的key
// 对象中的value就是store中保存该状态的value
export default combineReducers(
  {
    count:operaCount,
    person:operaPerson
  }
)