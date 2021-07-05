import {createStore, applyMiddleware} from 'redux'//从redux中引入createStore，用于创建最核心的store对象
import thunk from 'redux-thunk'
// import reducer from './reducer.js'

import reducer from './index.js'

// 引入redux-devtools-extension
import { composeWithDevTools } from 'redux-devtools-extension'
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))

