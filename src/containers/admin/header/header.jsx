import React,{Component} from 'react'
import {Icon,Modal,Button} from 'antd'
import {withRouter} from 'react-router-dom'//在非路由组件中，要使用路由组件的api
import  screenfull  from 'screenfull';
import {connect} from 'react-redux'
import dayjs from 'dayjs'
import menuList from '../../../config/menu_config'

import {createDeleteUserInfoAction} from '../../../redux/actions/login_action'
import './header.less'
// import {reqWeather} from '../../../api/index'

const {confirm}=Modal



@connect(
  state=>({userInfo:state.userInfo,
            tilte:state.title
  }),
  {
    deleteUser:createDeleteUserInfoAction
  }
)
@withRouter
 class Header extends Component{
  state={
    isFull:false,
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss ')
  }
  //切换全屏按钮的函数
  fullScreen=()=>{

    // screenfull.request();
    screenfull.toggle();
  }

   getWeather=async()=>{
    // let result=await reqWeather();
  }

   componentDidMount(){
    //给screenfull绑定监听
    screenfull.on('change', () => {
      let isFull=!this.state.isFull;
      this.setState({isFull})
    });
    this.time=setInterval(() => {
      this.setState({
        date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss ')
      })
    }, 1000);

    this.getWeather()
    this.getTitle()
    
  }

  componentWillUnmount(){
    clearInterval(this.time)
    
  }

  logOut=()=>{
    confirm({
      title: '确定退出?',
      content: '若退出，需要重新登录',
      okText:"确定",
      cancelText:'取消',
      onOk:()=> {
        this.props.deleteUser()
      },
     
    });

  }

  getTitle=()=>{
    let pathKey=this.props.location.pathname.split('/').reverse()[0]
    if(this.props.location.pathname.split('product')!==-1) pathKey='product'
    let title=''
    menuList.forEach(item=>{
        if(item.children instanceof Array){
        let tmp=  item.children.find(citem=>{
            return citem.key===pathKey
          })
          if(tmp) title=tmp.title
          
        }else{
            if(pathKey===item.key) title=item.title
        }
    })
    this.setState({
      title
    })
    //return title
  }
  render(){
    let {isFull}=this.state
    let {user}=this.props.userInfo
    return(
      <header className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.fullScreen}>
            <Icon type={isFull? 'fullscreen-exit' : 'fullscreen'}/>
            
          </Button>
          <span className='username'>欢迎，{user.username}</span>
          <Button type='link' onClick={this.logOut} size='small'>退出登录</Button>
        </div>
        <div className='header-bottom'>
            <div className='header-bottom-left'>
              {this.props.tilte||this.state.title}
            </div>
            <div className='header-bottom-right'>
              {this.state.date}
              <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气信息" />
              晴  温度 00
            </div>
        </div>
      </header>
    )
  }
}
export default Header
