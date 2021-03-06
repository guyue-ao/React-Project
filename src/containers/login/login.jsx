import React,{Component} from 'react'
import {Form,Icon,Input,Button,message} from 'antd';
import {connect} from 'react-redux'
import {reqLogin} from '../../api/index'
import {Redirect} from 'react-router-dom'
// import qs from 'querystring'
// import axios from 'axios'
import './css/login.less'
import logo from '../../static/imgs/logo.png'
import {createSaveUserInfoAction} from '../../redux/actions/login_action'

const {Item} = Form
@connect(
  state=>({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
    
  }
)
@Form.create()
class Login extends Component{

  

 
  // 密码的验证器
  pwdValidator=(rule,value,callback)=>{

    if(!value){
      // 提示密码必须输入
      callback('密码必须输入')
    }else if(value.length<4){
      // 密码必须大于等于4位
      callback('密码必须大于等于4位')
    }else if(value.length>12){
      // 密码必须小于等于12位
      callback('密码必须小于等于12位')
    }else if(!(/^\w+$/.test(value))){
      // 提示密码必须是字母、数字、下划线
      callback('提示密码必须是字母、数字、下划线')
    }else{
      callback()
    }

   
  }


  //点击登录按钮的回调
  handleSubmit = (event)=>{
    event.preventDefault();//阻止默认事件----禁止form表单提交----通过ajax请求
    this.props.form.validateFields(async(err, values) => {
      //values的值是{username:xxx,password:xxx}
      // console.log(values)
      const {username,password}=values;
      
      if (!err) {
        
        // reqLogin(username,password)
        // .then(result=>{
        //   console.log(result)
        // })
        // .catch(reason=>{
        //   console.log(reason)
        // })
        let result=await reqLogin(username,password)
        // console.log(result)
        const {status,msg,data}=result;
        if(status===0){
          // console.log(data);
          
            
            //1、先保存服务器返回的user信息，还有token，交由redux管理
            this.props.saveUserInfo(data)
            //2、然后跳转admin
            this.props.history.replace('/admin/home')
        }else{
            message.warning(msg,1)
        }
      }else{
        message.error('表单错误')
      }
    });
    
  }

  

  render(){
    const {getFieldDecorator} = this.props.form;
    const {isLogin}=this.props
    if(isLogin){
      return <Redirect to='/admin'/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
            {getFieldDecorator('username', {
              
                /*
                用户名/密码的的合法性要求
                  1). 必须输入
                  2). 必须大于等于4位
                  3). 必须小于等于12位
                  4). 必须是英文、数字或下划线组成
                */

                rules: [
                  {required: true, message: '用户名必须输入！'},//必须输入
                  {max:12,message:'用户名必须小于等于12位'},
                  {min:4,message:'用户名必须大于等于4位'},
                  {pattern:/^\w+$/,message:'用户名必须是字母数字下划线'}

                  ],
              })(
                <Input 
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}}/>}
                    placeholder="用户名"
                />,
              )}
            </Item>
            <Item>
            {getFieldDecorator('password', {
                rules: [
                  {validator: this.pwdValidator},
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Login

// export default connect(
//   state=>({isLogin:state.userInfo.isLogin}),
//   {
//     saveUserInfo:createSaveUserInfoAction,
    
//   }
// )(Form.create()(Login))



















/* 严重注意：
    1.暴露的根本不是我们定义的Login组件，而是经过加工（包装）的Login组件。
    2.Form.create()调用返回一个函数，该函数加工了Login组件，生成了一个新组件，新组件实例对象的props多了一个强大的form属性，能完成验证。
    3.我们暴露出去的不再是Login，而是通过Login生成的一个新组件。 
*/


/* 
  总结：
    1. 高阶函数
      定义: 如果函数接收的参数是函数或者返回值是函数
      例子: Promise() / then() / 定时器 / 数组遍历相关方法 / bind() / $() / $.get() / Form.create()
      好处: 更加动态, 更加具有扩展性
      
    2. 高阶组件
      定义: 参数为组件，返回值为新组件的函数
      例子: Form.create()(组件) / withRouter(组件) / connect()(组件)
      与高阶函数的关系?  
          高阶组件是一个特别的高阶函数
          接收的是组件函数, 同时返回新的组件函数
      作用:
          React 中用于复用组件逻辑的一种高级技巧

    Form.create()(Login), 接收一个Form组件, 返回一个新组件
      Form.create = function () {
        const form = 创建一个强大form对象
        return function (FormComponent) {
          return class WrapComponent extends Component {
            render () {
              return <Login form={form}/>
            }
          }
        }
      }
      const LoginWrap = Form.create()(Login)
*/

