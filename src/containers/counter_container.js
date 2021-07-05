import Counter from '../components/counter.jsx'
import {createIncrementAction,createDecrementAction,createIncrementAsyncAction} from '../redux/action_creator.js'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {count:state}
  
}

function mapDispatchToProps(dispatch) {
  return {
    increment:(value)=>{dispatch(createIncrementAction(value))},
    dccrement:(value)=>{dispatch(createDecrementAction(value))}

  }
}


//export default connect(mapStateToProps,mapDispatchToProps)(Counter)


//简写方式
export default connect(
  state=>({count:state.count,person:state.person}),
  {
    increment:createIncrementAction,
    dccrement:createDecrementAction,
    incrementAsync:createIncrementAsyncAction
  }
)(Counter)

//connect函数做了如下事情
// function connect(createIncrementAction) {
//   return (value)=>{dispatch(createIncrementAction(value))}
// }