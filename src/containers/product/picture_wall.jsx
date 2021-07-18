import React,{Component} from "react";
import { Upload, Icon, Modal, message } from 'antd';
import { BASE_URL} from '../../config/index'
import {reqDeletePicture} from '../../api/index'
//把图片变成base64编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  state = {
    previewVisible: false,//是否展示预览窗
    previewImage: '',//要预览的图片URL地址或base64编码
    fileList: [],//收集好的所有上传完毕的图片
  };
  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });
  //展示预览窗
  handlePreview = async file => {
    //如果图片没有url也没有转换过base64，那么调用如下方法把图片转换为base64
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
    //从fileList提取出所有该商品对应的图片的名字，构建一个数组，供新增商品使用
  getImgArr=()=>{
    let result=[];
    this.state.fileList.forEach((item)=>{
      result.push(item.name)
    })
    return result
  }
  setFileList=(imgArr)=>{
    let fileList=[];
    imgArr.forEach((item,index)=>{
        fileList.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({
      fileList
    })
  }

  //当图片状态发生改变的回调
  handleChange = async ({ fileList,file }) => {
    //若文件上传成功
   if(file.status==='done'){
     fileList[fileList.length-1].url=file.response.data.url;
     fileList[fileList.length-1].name=file.response.data.name;
   }
   //若删除图片
   if(file.status==='removed'){
      let result=await reqDeletePicture(file.name);
      let {status,data,msg}=result;
      if(status===0){
        message.success('删除成功')
      }else{
        message.error(msg)
      }
   }
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={` ${BASE_URL}/manage/img/upload`}//接收图片服务器的地址
          method='POST'
          name='image'
          listType="picture-card"//照片强的展示方式
          fileList={fileList}//图片列表，一个数组里面包含着多个图片对象
          onPreview={this.handlePreview}//当点击预览按钮的回调
          onChange={this.handleChange}//图片状态改变的回调（图片上传中，图片被删除，图片上传成功）
        >
         
      {fileList.length >= 4 ? null : uploadButton} 
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PicturesWall