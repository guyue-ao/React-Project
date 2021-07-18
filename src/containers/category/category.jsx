
import React,{Component} from 'react'
import { Card,Icon ,Button,Table, message,Modal,Form ,Input} from 'antd';
import { connect } from 'react-redux';
import { reqCategoryList, reqUpdateCategory } from '../../api/index';
import {PAGE_SIZE} from '../../config/index'
import { reqAddCategory } from '../../api/index';
import {createSaveCategoryAction} from '../../redux/actions/category_action'
// import {requUpdateCategory} from '../../api/index'
const {Item}=Form
@connect(
  state=>({}),
  {saveCategory:createSaveCategoryAction}
)
@Form.create()
 class Category extends Component{

  state={
    categoryList:[],//商品分类列表
    visible:false,
    operType:'',//操作类型
    isLoading:true,//是否处于加载
    modalCurrentValue:'',//弹窗显示的值
    modalCurrentID:'',//
  }

//获取商品分类列表
  getCategoryList=async()=>{
    let result =await reqCategoryList()
    this.setState({isLoading:false})
    const {status,msg,data}=result;
    // console.log(result)
    if(status===0) {this.setState({categoryList:data.reverse()})
      //把商品往redux中存
      this.props.saveCategory(data)
  
  }
    else message.error(msg,1)
    
  }

componentDidMount(){
    this.getCategoryList()    
}
//添加分类
toAdd=async(values)=>{
let result=await reqAddCategory(values)

// console.log(result)
const {status,msg,data}=result;
if(status===0) {
  message.success('添加成功',1);
  let categoryList=[...this.state.categoryList];
  categoryList.unshift(data);
  this.setState({categoryList})
  //清除表单内容
  this.props.form.resetFields()
  //隐藏表单
  this.setState({visible: false,});
}
if(status===1) message.error(msg,1);
}
//跟新分类
toUpdate=async(categoryObj)=>{
  
let result=await reqUpdateCategory(categoryObj);
let {status,msg}=result
if(status===0){
  message.success('更新成功',1);
  this.getCategoryList()
  //清除表单内容
  this.props.form.resetFields()
  //隐藏表单
  this.setState({
   
    visible: false,
    
  });
}else{
  message.error(msg,1)

}
}
//新增的回调
showAdd = () => {
  this.setState({
    visible: true,
    operType:'add',
    modalCurrentValue:'',
    modalCurrentID:'',
  });
};


//修改的回调
showUpdate = (item) => {
  const {_id,name}=item;
  this.setState({
    visible: true,
    operType:'update',
    modalCurrentValue:name,
    modalCurrentID:_id,
  });
  // console.log(item)
};


//点击ok的回调
handleOk = () => {
  // console.log(e);
  const {operType}=this.state;
  //表单校验
  this.props.form.validateFields(async(err,values)=>{

    if(err){ 
      message.warning('表单输入有误',5)
      return 
  }
  

  if(operType==='add') {
    this.toAdd(values)
  }
  if(operType==='update') {
  
    const categoryId=this.state.modalCurrentID;
    const categoryName=values.categoryName;
    const categoryObj={categoryId,categoryName}
  this.toUpdate(categoryObj)
  }
  })  
};
//点击取消的回调
handleCancel = ()=> {
  // console.log(e);
  this.setState({
    visible: false,
  });
  this.props.form.resetFields()
};

  
  render(){
    let {operType,visible}=this.state
    let {getFieldDecorator}=this.props.form
    const dataSource = this.state.categoryList
    const columns = [
      {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'categoryName',
        key: 'age',
        width:'25%',
        render:(item)=>{ return <Button type='link'  onClick={()=>{this.showUpdate(item)}}>修改分类</Button>},
        align:'center'
      }
    ];
    return(
      <div>
        <Card  extra={<Button type='primary' onClick={this.showAdd} ><Icon type="plus-circle" />添加</Button>} >
        <Table 
        dataSource={dataSource} 
        columns={columns} 
        bordered={true} 
        rowKey='_id'
        pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
        loading={this.state.isLoading}
        />
        
    </Card>
    <Modal
          title={operType==='add'?'新增分类':'修改分类'}
          visible={this.state.visible}
          okText='确定'
          cancelText='取消'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
            {getFieldDecorator('categoryName', {
              
                initialValue:this.state.modalCurrentValue,
                rules: [
                  {required: true, message: '分类名必须输入！'},//必须输入
                  

                  ],
              })(
                <Input 
                   
                    placeholder="请输入分类名"
                />,
              )}
            </Item>
            
          </Form>
        
          
        </Modal>
      </div>
    )
  }
}
export default Category