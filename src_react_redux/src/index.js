import React from 'react'
import ReactDom from 'react-dom'
import App from './App.js'
import store from './redux/store.js'
import {Provider} from 'react-redux'


ReactDom.render(
  <Provider store={store}>
<App store={store}/>
</Provider>
,
document.getElementById('root'));

