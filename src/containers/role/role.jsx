
import React,{Component} from 'react'
import dayjs from 'dayjs'
import { Card,Button,Icon,Table,message,Modal,Form,Input,Tree } from 'antd'
import { reqRoleList ,reqAddRole,reqAuthRole} from '../../api'
import menuList from '../../config/menu_config'
import  {connect} from 'react-redux'
const {Item}=Form
const { TreeNode } = Tree
@connect(
  state=>({username:state.userInfo.user.username}),
  {}
)
@Form.create()
 class Role extends Component{
state={
  isShowAdd:false,
  isShowAuth:false,
  roleList:[],
  //expandedKeys: ['0-0-0', '0-0-1'],//配置默认打开哪一个节点
  checkedKeys: [],//选中的菜单
  menuList,
  _id:'',//当前操作的角色id
 
}
getRoleList=async()=>{
let result=await reqRoleList()
const {status,data,msg}=result
if(status===0) this.setState({roleList:data})
}
componentDidMount(){
this.getRoleList()
}
handleOk=()=>{
  // alert('提交表单')
  //验证表单
  this.props.form.validateFields(async(err,values)=>{
    if(err) return 
    let result=await reqAddRole(values)
    
    console.log(values)
    const {status,data,msg}=result
    if(status===0) {
      message.success('授权成功');
      this.getRoleList()
      this.setState({
        isShowAdd:false
      })
    }else{
      message.error(msg)
    }
  })
}
handleCancel=()=>{
  this.setState({
    isShowAdd:false
  })
}
//授权弹窗  确定
handleAuthOk=async()=>{
  const {_id,checkedKeys}=this.state
  const {username}=this.props
let result=await reqAuthRole({_id,menus:checkedKeys,auth_name:username})
// console.log(result)
const {status,msg,data}=result;
if(status===0) {
  message.success('操作成功',1);
  this.setState({isShowAuth:false,checkedKeys:[]});
  this.getRoleList();
}
else message.error(msg,1)
}

//授权弹窗  取消
handleAuthCancel=()=>{
this.setState({
  isShowAuth:false,
  
})
}

//---------------tree------start------
onExpand = expandedKeys => {
  console.log('onExpand', expandedKeys);
  // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  // or, you can remove all expanded children keys.
  this.setState({
    expandedKeys,
    autoExpandParent: false,
  });
};

onCheck = checkedKeys => {
  console.log('onCheck', checkedKeys);
  this.setState({ checkedKeys });
};
//用于展示授权弹窗
showAuth=(id)=>{
  const {roleList}=this.state
  console.log(roleList)
  let result=roleList.find((item)=>{
    return item._id===id
  })
  if(result) this.setState({checkedKeys:result.menus})
  this.setState({isShowAuth:true,_id:id,})

}
//用于展示新增弹窗
showAdd=()=>{
  this.props.form.resetFields();
  this.setState({isShowAdd:true});

}



renderTreeNodes = (data) =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });

  render(){

    //treeData是树形菜单的原数据
    
    const treeData=this.state.menuList
    const dataSource=this.state.roleList
    // console.log(this.state.roleList)
    const columns=[
      {
        title:'角色名称',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        key:'create_time',
        render:(time)=>{return dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss ')}
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        key:'auth_time',
        render:(time)=>{ return time? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss '):''}
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
        key:'auth_name',
      },
      {
        title:'操作',
        // dataIndex:'menus',
        key:'option',
        render:(item)=>{return (<Button type='link' onClick={()=>{this.showAuth(item._id)}} >设置权限</Button>)}
      },
      
    ]
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        
        <Card
        title={
          <Button type='primary' onClick={()=>{this.showAdd()}}>
            <Icon type='plus' />
            新增角色
          </Button>}
          style={{width:'100%'}}
        >
          <Table 
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{defaultPageSize:5}}
            rowKey='_id'
          
          />
        </Card>

          {/* 新增角色提示框 */}
        <Modal
        title='新增角色'
        visible={this.state.isShowAdd}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText='确认'
        cancelText='取消'
        >
          <Form onSubmit={this.handleOk}>
            <Item>
              {getFieldDecorator('roleName',{
                initialvalue:'',
                rules:[
                  {require:true,message:'角色名必须输入'}
                ]
              })
              (
                <Input placeholder='请输入角色名'/>
              )
              
              }
            </Item>
          </Form>
        </Modal> 
        {/* 设置权限弹窗 */}
    <Modal
        title='设置权限'
        visible={this.state.isShowAuth}
        onOk={this.handleAuthOk}
        onCancel={this.handleAuthCancel}
        okText='确认'
        cancelText='取消'
        >
        <Tree
          checkable //允许选中
          onExpand={this.onExpand} //收缩或展开菜单的回调
          //expandedKeys={this.state.expandedKeys}//一上来就展开
          // autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          defaultExpandAll={true}
          
        >
        <TreeNode title='平台权限' key='top'>
          {this.renderTreeNodes(treeData)}
        </TreeNode>
          
      </Tree>
    </Modal> 
      
      
      </div>
    )
  }
}
export default Role