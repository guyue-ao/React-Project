//从reddux中引入createStore 用于创建最核心的store
import {createStore,applyMiddleware} from 'redux'

//引入reducer

import reducers from './reducers/index.js'

//引入redux-think
import thunk from 'redux-thunk'

//引入redux-devtools-extenson 用于支持redux开发者调工具的运行

import {composeWithDevTools} from 'redux-devtools-extension'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)));