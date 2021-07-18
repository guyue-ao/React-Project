import React,{Component} from "react";
import {Card,Form,Input,Icon,Select,Button,message } from "antd";
import {connect} from 'react-redux'
import {reqCategoryList,reqAddProduct,reqProdById,reqUpdateProduct} from '../../api/index'
import PicturesWall from "./picture_wall";
import RichTextEditor from "./rich_text_editor";

const {Item}=Form
const {Option}=Select
@connect(
  state=>({
    categoryList:state.categoryList,
    productList:state.productList
  
  }),
  {}
)
@Form.create()
 class AddUpdate extends Component{

    state={
      categoryList:[],
      operaType:'add',
      categoryId:'',
      name:'',
      desc:'',
      price:'',
      detail:'',
      imgs:[],
      _id:'',
    }
    handleSubmit=(event)=>{
        event.preventDefault()
        // 从上传组件中获取已经上传的图片数组
        // console.log(this.refs.pictureWall.getImgArr());
        let imgs = this.refs.pictureWall.getImgArr();
        //从富文本组件中获取用户输入的文字转换为富文本的字符串
        let detail=this.refs.richTextEditor.getRich()
        const {operaType,_id}=this.state
        this.props.form.validateFields(async(err,values)=>{
          let result
          if(operaType==='add'){
            result=await reqAddProduct({...values,imgs,detail})
          }else{
            result=await reqUpdateProduct({...values,imgs,detail,_id})
          }
          
          const {status,data,msg}=result;
          if(status===0) {message.success('操作成功')
              this.props.history.replace('/admin/prod_about/product')
        }
          else message.error(msg)
        })
    }
    getCategoryList=async()=>{
      let result=await reqCategoryList()
      const {status,msg,data}=result;
      if(status===0){
        this.setState({
          categoryList:data
        })
      }else{
          message.error(msg)
      }
    }
    componentDidMount(){
      // console.log(this.props.categoryList)
      const {categoryList,productList}=this.props;
      const {id}=this.props.match.params
      if(categoryList.length) this.setState({categoryList})
      else{
        this.getCategoryList()
      }
      if(id) {
        this.setState({operaType:'update'})
        if(productList.length){
          let result=productList.find(item=>{
            return item._id===id
          })
          if(result) {
            
            this.setState({...result});
            this.refs.pictureWall.setFileList(result.imgs);
            this.refs.richTextEditor.setRichText(result.detail)
          
          }
        }else{
          this.getProductList(id)
        }
      }

    }
    getProductList=async(id)=>{
      let result=await reqProdById(id);
      const {status,data,msg}=result;
      if(status===0){
        this.setState({...data})
        this.refs.pictureWall.setFileList(data.imgs);
            this.refs.richTextEditor.setRichText(data.detail)
      }
    }
  render(){
    //getFieldDecorator 包装Form 组件
    const {getFieldDecorator}=this.props.form;
    const {operaType}=this.state
    // 左上角区域
    const title=(
      <div>
        <Button type='link' onClick={this.props.history.goBack}>
        <Icon type="arrow-left" />
        <span>返回</span>
        </Button>
        <span>{operaType==='update'?'商品修改':'商品添加'}</span>
      </div>
    )
    //控制表单左右比例
    const formItemLayout={
      labelCol:{
        md:{span:2}
      },
      wrapperCol:{
        md:{
          span:9
        }
      }
    };
    return(
      <div>
        <Card title={title}  >
          <Form 
             labelCol={{md:2}} 
             wrapperCol={{md:9}}
             onSubmit={this.handleSubmit} className="login-form">
            <Item label='商品名称'>
              {getFieldDecorator('name', {
                initialValue:this.state.name ||'',
                rules: [{ required: true, message: '请输入商品名称' }],
              })(
                <Input
                  placeholder="商品名称"
                />,
              )}
            </Item>
            <Item label='商品描述'>
              {getFieldDecorator('desc', {
                initialValue:this.state.desc ||'',
                rules: [{ required: true, message: '请输入商品描述' }],
              })(
                <Input
                  placeholder="商品描述"
                />,
              )}
            </Item>
            <Item label='商品价格'>
              {getFieldDecorator('price', {
                initialValue:this.state.price ||'',
                rules: [{ required: true, message: '请输入商品价格' }],
              })(
                <Input
                addonAfter='元'
                prefix='￥'
                type='number'
                  placeholder="商品价格"
                />,
              )}
            </Item>
            <Item label='商品分类'>
              {getFieldDecorator('categoryId', {
                initialValue:this.state.categoryId ||'',
                rules: [{ required: true, message: '请输入商品价格' }],
              })(
                <Select>
                  <Option value=''>请选择分类</Option>
                  {
                    this.state.categoryList.map(item=>{
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Item>
            <Item label='商品图片'
            wrapperCol={{md:14}}
            >
              <PicturesWall ref='pictureWall'/>
            </Item>
            <Item label='商品详情'
            wrapperCol={{md:12}}
            >
              <RichTextEditor ref='richTextEditor'/>
            </Item>
            <Button type='primary' htmlType='submit'>提交</Button>
          </Form>
        </Card>
      </div>
    )
  }
}
export default AddUpdate