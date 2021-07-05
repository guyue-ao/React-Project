import React,{Component} from 'react'


export default class Counter extends Component{
  
  componentDidMount(){
    console.log(this.props);
  }
  //加
  increment=()=>{
    let {value}=this.refs.selectNumber;
  //  this.props.store.dispatch(createIncrementAction(value*1))
  this.props.increment(value*1);

  }
  //减
  decrement=()=>{
    let {value}=this.refs.selectNumber;
    // this.props.store.dispatch(createDecrementAction(value*1))
    this.props.dccrement(value*1)
  
  }

  incrementifodd=()=>{
    let {value}=this.refs.selectNumber;
    
    // if(this.props.store.getState()%2===1){
    //   this.props.store.dispatch(createIncrementAction(value*1))
    // }
    if(this.props.count%2===1){
      this.props.increment(value*1);
    }
    
    
  }
  incrementAsync=()=>{
    let {value}=this.refs.selectNumber;

    setTimeout(() => {
      // this.props.store.dispatch(createIncrementAction(value*1))
      this.props.increment(value*1);
    },100);
  }

  render(){
   
    return(
      <div>
        <h1>计数位{this.props.count}</h1>
        <select ref='selectNumber'>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementifodd}>add</button>
        <button onClick={this.incrementAsync}>aysn</button>
      </div>
    )
  }
}