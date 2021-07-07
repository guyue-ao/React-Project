import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/actions/login_action'


class Admin extends Component{

componentDidMount(){
  console.log(this.props);
}
logout=()=>{
this.props.deleteUserInfo()
}

//在render里若想实现跳转，最好用<Redirect>
  render(){
    const {user,token,isLogin}=this.props.userInfo
    if(!isLogin){
        return <Redirect to='/login'/>
    }else{
    return (
      <div>
      <div>
        我是admin组件，你的名字是{this.props.userInfo.user.username}
      </div>
      <button onClick={this.logout}>退出登录</button>
      </div>
    )}
  }
}

export default connect(
  state=>({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
  )(Admin)