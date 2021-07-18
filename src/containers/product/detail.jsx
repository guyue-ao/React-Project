
import React,{Component} from "react";
import { Button ,Card,Icon,List, message } from "antd";
import {connect} from 'react-redux'
import {reqProdById,reqCategoryList} from '../../api/index'
import './detail.less'
const {Item}=List
@connect(
  state=>({productList:state.productList,
  categoryList:state.categoryList
  }),
{}
)
class Detail extends Component{

  state={
    categoryId:'',
    desc:'',
    detail:'',
    imgs:[],
    name:'',
    price:'',
    categoryName:'',
    isLoading:true,
    
  }

    componentDidMount(){
      console.log(this.props.productList);
      const reduxProdList=this.props.productList;
      const reduxCateList=this.props.categoryList;
      // console.log(this.props.match);
      if(reduxProdList.length !==0){
        let result= reduxProdList.find((item)=>{
          return item._id===this.props.match.params.id
      })
      if(result){
        const {categoryId,desc,detail,imgs,name,price}=result;
        this.categoryId=result.categoryId;
        this.setState({
          categoryId,desc,detail,imgs,name,price
        })
      }
      }else{
        this.getProdById(this.props.match.params.id)
      }
      if(reduxCateList.length){
          let result=reduxCateList.find((item)=>{
              return item._id===this.categoryId
          })
          this.setState({
            categoryName:result.name,
            isLoading:false
          })
      }else{
        this.getCategoryList()
      }
     
    }
    getProdById=async (id)=>{
      let result=await reqProdById(id)
      // console.log(result);
      const {status,data,msg}=result;
      const {categoryId,desc,detail,imgs,name,price}=data
      if(status===0){
        this.categoryId=data.categoryId;
        this.setState({
          categoryId,desc,detail,imgs,name,price
        })
      }else{
        message.error(msg)
      }
    }

    getCategoryList=async()=>{
      let result=await reqCategoryList()
      const {status,data,msg}=result;
      if(status===0){
          let result=data.find(item=>{
            return item._id===this.categoryId
          })
          if(result){
            this.setState({
              categoryName:result.name,
              isLoading:false
            })
          }
      }else{
        message.error(msg)
      }
    }
  render(){
    return(
      <div>
        <Card 
        loading={this.state.isLoading}
        title={
          <div  className='left-top'>
        <Button type='link' size='small'onClick={()=>{this.props.history.goBack()}}>
          <Icon type="arrow-left" />
        </Button>
          <span>商品详情</span>
        </div>}>
          <List>
            <Item>
              <span className='prod-title'>商品名称</span>
              <span>{this.state.name}</span>
            </Item>
            <Item>
              <span className='prod-title'>商品描述</span>
              <span>{this.state.desc}</span>
            </Item>
            <Item>
              <span className='prod-title'>商品价格</span>
              <span>{this.state.price}</span>
            </Item>
            <Item>
              <span className='prod-title'>所属分类</span>
              <span>{this.state.categoryName}</span>
            </Item>
            <Item>
              <span className='prod-title'>商品图片</span>
              <span>{this.state.imgs.map((item,index)=>{
                return <img key={index} src={`/upload/`+item} alt="商品图片" style={{width:'200px'}} />
              })}</span>
            </Item>
            <Item>
              <span className='prod-title'>商品详情</span>
              <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
            </Item>
            
          </List>
        </Card>
        
      </div>
    )
  }
}
export default Detail