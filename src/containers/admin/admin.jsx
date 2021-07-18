import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import {createDeleteUserInfoAction} from '../../redux/actions/login_action'
// import {reqCategoryList} from '../../api/index'
import './css/admin.less'
import Header from './header/header'
import  Home  from "../../components/home";
import  Category from '../category/category'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
import Product from '../product/product';
import Detail from '../product/detail';
import AddUptate from '../product/add_update';
import Role from '../role/role';
import LeftNav from './left_nav/left_nav'
import User from '../user/user'

const {  Footer, Sider, Content } = Layout;
@connect(
  state=>({userInfo:state.userInfo}),
  {
    deleteUserInfo:createDeleteUserInfoAction
  }
  )
  class Admin extends Component{

componentDidMount(){
  // console.log(this.props);
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
      <Layout className='admin'>
        <Sider className='sider'>
          <LeftNav />
        </Sider>
        <Layout>
          <Header >Header</Header>
          <Content className='content'>
            <Switch>
            <Route path='/admin/home' component={Home}/>
            <Route path='/admin/prod_about/category' component={Category} />
            <Route path='/admin/prod_about/product' component={Product} exact />
            <Route path='/admin/prod_about/product/detail/:id' component={Detail} />
            <Route path='/admin/prod_about/product/add_update' component={AddUptate} exact />
            <Route path='/admin/prod_about/product/add_update/:id' component={AddUptate} />
            <Route path='/admin/user' component={User} />
            <Route path='/admin/role' component={Role} />
            <Route path='/admin/charts/bar' component={Bar} />
            <Route path='/admin/charts/line' component={Line} />
            <Route path='/admin/charts/pie' component={Pie} />
            <Redirect to='/admin/home'/>
            </Switch>
          </Content>
          <Footer className='footer'>推荐使用谷歌浏览器，获取最佳用户体验
          
          </Footer>
        </Layout>
      </Layout>
  
    )}
  }
}
export default Admin
// export default connect(
//   state=>({userInfo:state.userInfo}),
//   {
//     deleteUserInfo:createDeleteUserInfoAction
//   }
//   )(Admin)