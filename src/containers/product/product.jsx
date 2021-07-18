
import React,{Component} from 'react'
import {Card,Button,Icon, Select,Input,Table, message} from 'antd'
import {connect} from 'react-redux'
import {reqProductList} from '../../api/index'
import { PAGE_SIZE } from '../../config/index'
import {reqUpdateProdStatus,reqSearchProduct} from '../../api/index'
import {createSaveProductAction} from '../../redux/actions/product_action'
const {Option}=Select
@connect(
  state=>({}),
  {
    saveProduct:createSaveProductAction
  }

)
 class Product extends Component{
  
  state={
    productList:[],//商品列表数据（分页）
    total:'',//总共有多少个数据
    current:1,//当前在那一页
    keyWord:'',//搜索关键词
    searchType:'productName',//搜索类型


  }
  componentDidMount(){
    this.getProductList()
  }
  getProductList=async(number=1)=>{
    let result
    if(this.isSearch){
     result=await reqSearchProduct(number,PAGE_SIZE,this.state.searchType,this.state.keyWord);}
    else{ result=await reqProductList(number,PAGE_SIZE)}
    const {status,data}=result;
   
      // console.log(data)
      if(status===0){
          this.setState({
            productList:data.list,
            total:data.total,
            current:data.pageNum
          })
          //把获取的商品列表存入到redux中

      }else{
        message.error('获取商品列表失败')
      }
       this.props.saveProduct(data.list);
  }

  updateProdStatus=async({_id,status})=>{
      // console.log(id)
      let {productList}=this.state
      if(status===1) status=2
      else status=1
      let result=await reqUpdateProdStatus(_id,status)
     if(result.status===0) {       
       message.success('成功',1)
         productList=productList.map((item)=>{
          if(item._id===_id) {
            item.status=status
          }
          return item
        })
        this.setState({
          productList
        })
      }
     
     else message.error('更新失败');
  }

  demo=(event)=>{
      this.setState({
        keyWord:event.target.value
      })
  }
  sel=(value)=>{
    this.setState({
      searchType:value,
    })
  }
  search=async()=>{
    this.isSearch=true;
    this.getProductList()
    
    // console.log(result)
  }
  render(){
    const dataSource = this.state.productList
    
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        width:'15%',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        align:'center',
        key: 'price',
        width:'9%',
        render:(price)=>{return '￥'+price}
      },
      {
        title: '状态',
        // dataIndex: 'status',
        align:'center',
        width:'10%',
        key: 'status',
       render:(item)=>{
         return(
         <div>
           <Button 
           
            type={item.status===1?'danger':'primary'}
            onClick={()=>{this.updateProdStatus(item)}}
           >
              {item.status===1?'下架':"上架"}
           </Button><br/>
           <span>{item.status===1?'在售':'停售'}</span>
         </div>
         )
       }
      },
      {
        title: '操作',
        //dataIndex: 'opera',
        align:'center',
        key: 'opera',
        width:'10%',
        render:(item)=>{
          return(
            <div>
              <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
              <Button type='link' onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
            </div>
          )
        }
      },
    ];
    return(
      <div>
        <Card title={
          <div>
            <Select defaultValue="productName" onChange={this.sel}>
              <Option value="productName">按名称收索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input 
              onChange={this.demo}
              allowClear={true}
              style={{margin:'0px 10px',width:'20%'}}
              placeholder="请输入搜索关键字" /
            >
              <Button onClick={this.search} type='primary'><Icon type="search" />搜索</Button>
          </div>
        }
         bordered 
         extra={<Button onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}} type='primary'><Icon type="plus-circle" />添加商品</Button>} 
         >
         <Table
          dataSource={dataSource} 
          columns={columns} 
          bordered 
          rowKey='_id'
          pagination={{
              total:this.state.total,
              pageSize:PAGE_SIZE,
              current:this.state.current,
              onChange:this.getProductList,
          }}
         />
    </Card>
      </div>
    )
  }
}
export default Product