import React,{Component} from 'react'
import { Menu, Icon } from 'antd';
import {connect} from 'react-redux'
import {Link,withRouter} from 'react-router-dom'
import logo from '../../../static/imgs/logo.png'
import menuList from '../../../config/menu_config'
import {createSaveTitleAction} from '../../../redux/actions/menu_action'
import './left_nav.less'
const { SubMenu ,Item} = Menu;

@connect(
  state=>({menus:state.userInfo.user.role.menus,
            username:state.userInfo.user.username
        }),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
 class leftNav extends Component{

  componentDidMount(){
    
  }

  hasAuth=(item)=>{
    // 校验菜单权限

    //获取当前用户可以看到的菜单的数组
    const {menus,username}=this.props
    console.log(item);
    if(username==='admin') return true
    else if(!item.children){
      return menus.find((item2)=>{return item2===item.key})
    }else if(item.children){
      return item.children.some((item3)=>{return menus.indexOf(item3.key)!==-1})
    }

    // return true

  }
//用于创建菜单的函数
  createMenu=(target)=>{
      return target.map((item)=>{
        
          if(this.hasAuth(item)){
            if(!item.children){
              return(<Item key={item.key} onClick={()=>{this.props.saveTitle(item.title)}}>
                <Link to={item.path}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
               </Link>
               </Item>)
            }else{
              return(
          <SubMenu
          key={item.key}
          title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>
          }
        >
          {this.createMenu(item.children)}
          {/* <Item key="5">Option 5</Item>
          <Item key="6">Option 6</Item>
          <Item key="7">Option 7</Item>
          <Item key="8">Option 8</Item> */}
        </SubMenu>
        
              )
            }
          }
        
      })
  }

  render(){
    return (
      <div>
       <header className='nav-header'>
         <img src={logo} alt="" />
         <h1>商品管理系统</h1>
       </header>
        <Menu
          selectedKeys={this.props.location.pathname.indexOf('product')!==-1?'product':this.props.location.pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
          // inlineCollapsed={true}
        >
          {
            this.createMenu(menuList)
          }
          
        
        </Menu>
      </div>
    )
  }
}
export default leftNav