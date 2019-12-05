import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
  Popconfirm,
  message,
  Tag,
  Avatar,
  Upload
} from 'antd';
import PointList from './PointList';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import { uploadImage, getSectorName } from '@/services/project';
import sectorModel from './sectorModel';
import styles from './style.less';
import $ from 'jquery';
import { upload } from './upload';
import imageCompression from 'browser-image-compression';

const FormItem = Form.Item;
const { TextArea } = Input;

@observer
@Form.create()
class BindPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlePointListVisible: false,
      handleAddImgVisible: false,
      previewVisible: false,

      PointImageList: [],

      getPointImageListLoading: false,
    };
  }

  handlePointListVisible = flag => {
    this.setState({ handlePointListVisible: flag });
  }

  handleAddImgVisible = flag => {
    this.setState({ handleAddImgVisible: flag });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // this.setState({
      //   formValues: fieldsValue,
      // }, _ => { this.queryDataSource() });
      console.log(fieldsValue);

    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="图片名称">
          {getFieldDecorator('type')(
            <Input placeholder="请输入布点图名称" style={{ width: '200px' }} />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={e => {
            e.preventDefault();
            this.handleFormReset();
          }}>
            重置
          </Button>
        </FormItem>
        {/* <Divider /> */}
        {/* <FormItem>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            // this.handleDrawerVisible(true);
          }}>
            添加布点图
          </Button>
        </FormItem> */}
      </Form>
    );
  }

  delectPointImage = id => {
    axios.delete('/monitorPoint/removeMonitorPointImage', {
      params: {
        sectorId: sectorModel.sectorId,
        imageId: id
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getPointImageList();
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const columns = [
      {
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'url',
        render: text => (
          
          <Upload
            //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              //url: window.imgAddress + text,
              url: `https://monitor-1254331889.cos.ap-guangzhou.myqcloud.com${text}`
            },]}
            onPreview={_ => { this.setState({ previewVisible: 'true', previewUrl: text });console.log('文件地址:',text); }}
          // onChange={this.handleChange}
          >
            {/* {fileList.length >= 8 ? null : uploadButton} */}
          </Upload>
        ),
      },
      {
        title: '名称',
        dataIndex: 'imageName',
        key: 'name',
      },
      {
        title: '图片描述',
        dataIndex: 'imageDes',
        key: 'des',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              this.handlePointListVisible(true);
              sectorModel.selectImageId = text.imageId;
              console.log('text:',text);
              sectorModel.selectImageUrl = text.imageUrl;
            }}>详情</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={this.delectPointImage.bind(this, text.imageId)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          {/* {this.renderSimpleForm()}*/}
          <Button type='primary' onClick={_ => { this.handleAddImgVisible(true) }}>添加布点图</Button>
          <Divider />
          
          <Table loading={this.state.getPointImageListLoading} columns={columns} dataSource={this.state.PointImageList} />
        </Card>

        {/* 添加布点图 */}
        <AddImg
          visible={this.state.handleAddImgVisible}
          handleAddImgVisible={this.handleAddImgVisible}
          getPointImageList={this.getPointImageList}
        />

        {/* 布点图测点信息 */}
        <PointList
          visible={this.state.handlePointListVisible}
          handlePointListVisible={this.handlePointListVisible}
        />

        <Modal visible={this.state.previewVisible} footer={null} onCancel={_ => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={'https://monitor-1254331889.cos.ap-guangzhou.myqcloud.com' + this.state.previewUrl} />
        </Modal>
      </Fragment>
    );
  }
  componentDidMount() {
    this.getPointImageList();
  }
  getPointImageList = () => {
    this.setState({ getPointImageListLoading: true });
    axios.get('/image/listSectorPointImage', {
      params: {
        sectorId: sectorModel.sectorId
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        // console.log(data);
        this.setState({ PointImageList: data });
        console.log('布点图列表:',this.state.PointImageList);
      } else {
        this.setState({ PointImageList: [] });
      }
      this.setState({ getPointImageListLoading: false });
    }).catch(err => {
      this.setState({ PointImageList: [] });
      this.setState({ getPointImageListLoading: false });
      console.log(err);
    });
  }
}

@Form.create()
class AddImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectorName:'',
      fileWidth:'',
      fileHeight:'',
      fileWidth1:'',
      fileHeight1:'',
      
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="布点图"
        width={500}
        onClose={_ => { this.props.handleAddImgVisible(false);this.props.getPointImageList() }}
        visible={this.props.visible}
      >
        <div id="dropbox">
          <input multiple type='file' ref='file' name="file" />
          <Button onClick={_ => { this.handleFiles() }} style={{marginTop:'10px'}}>生成缩略图</Button>
        </div>
        <div id="previewtitle" style={{display:'none',marginTop:'20px'}}>缩略图</div>
        <div id="preview"></div>
        <img src="" alt="" id="show" />
        <Button onClick={_ => {
          this.upLoad();
          
        }} style={{marginTop:'10px'}}>
          <Icon type='upload' />上传布点图
        </Button>
      </Drawer >
    );
  }
  
  handleFiles() {
    document.getElementById('previewtitle').style.display = 'block';
    let orifile = this.refs.file.files[0];
    imageCompression(orifile,{
      maxWidthOrHeight:400
    }).then(tbFile=>{
      // 创建img对象
      let img = document.createElement("img");
      preview.appendChild(img);
      let reader = new FileReader();
      reader.readAsDataURL(tbFile);
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target.result;
          aImg.id = 'thumbnailImg';
        };
      })(img);
    }).catch(e=>{

    })    
  }
  //上传图片
  upLoad() {
    //子项目id
    const sectorId = sectorModel.sectorId;
    let file = this.refs.file;
    let firstFile = file.files[0];
    console.log(firstFile);
    let imageType = firstFile.name.split('.')[1];
    console.log(imageType);
    //let fileType = firstFile.
    //布点图路径
    let url = `/images/pointMap/${sectorId}/${Math.random()+firstFile.name}`;
    let url1 = `/images/pointMap/${sectorId}/tb${Math.random()+firstFile.name}`;
    // let url = `/images/pointMap/${sectorId}/${Math.random()}`;
    // let url1 = `/images/pointMap/${sectorId}/${Math.random()}`;
    console.log('布点图地址:',url);
    let imageName = `${this.state.sectorName}布点图`;
    let imageName1 = `${this.state.sectorName}缩略图`;
    let imageDescription = `${this.state.sectorName}布点图原图`;
    //读取图片并获取图片宽高
    let reader = new FileReader();
    reader.readAsDataURL(firstFile);
    
    //上传至COS
    //上传布点图
    upload(url, firstFile, (err, data) => {
      if(err){
          message.info('布点图上传至COS失败!');
      }
      if(!err){
          console.log('this:',this);
          message.success('布点图上传至COS成功');
          //this.props.handleAddImgVisible(false);this.props.getPointImageList();
      }     
    })
    //上传缩略图
    imageCompression(firstFile,{
      maxWidthOrHeight:400
    }).then(tbFile=>{
      //reader.readAsDataURL(tbfile);
      upload(url1, tbFile, (err, data) => {
        if(err){
            message.info('布点图缩略图上传至COS失败!');
        }
        if(!err){
            message.success('布点图缩略图上传至COS成功');
            console.log('this:',this);
            this.props.handleAddImgVisible(false);this.props.getPointImageList();
            //读取完成获取宽高
            reader.onload = function() {
              var imgURL = this.result;
              var imgURL1 = document.getElementById('thumbnailImg').src;
              var image = new Image();
              var image1 = new Image();
              image.src = imgURL;
              image1.src = imgURL1;
              image.onload = function(){
                //获取Image对象的宽高
                var fileWidth = this.width;
                var fileHeight = this.height;
                let result = [];
                result.push({
                  imageType:1,
                  originalImage:{
                    imageDescription: imageDescription,
                    imageHeight: fileHeight,
                    imageWidth: fileWidth,
                    imageName: imageName,
                    imageUrl: url,
                    imageType: 3,
                  },
                  sectorId: sectorId,
                  thumbnail:{
                    imageHeight: image1.height,
                    imageWidth: image1.width,
                    imageName: imageName1,
                    imageUrl: url1,
                    imageType: 1,
                  }
                });
                console.log(result);
                //上传至数据库
                axios.post('/image/addListImage',result)
                .then(res => {
                  const { code, msg, data } = res.data;
                  if( code === 0) {
                    message.success('添加布点图成功！');
                    console.log('开始关闭！！')
                    
                  }else{
                    message.info(msg);
                  }
                });       
              };
            }
        }     
      })
    }).catch(e=>{
    })   
    // //读取完成获取宽高
    // reader.onload = function() {
    //   var imgURL = this.result;
    //   var imgURL1 = document.getElementById('thumbnailImg').src;
    //   var image = new Image();
    //   var image1 = new Image();
    //   image.src = imgURL;
    //   image1.src = imgURL1;
    //   image.onload = function(){
    //     //获取Image对象的宽高
    //     var fileWidth = this.width;
    //     var fileHeight = this.height;
    //     let result = [];
    //     result.push({
    //       imageType:1,
    //       originalImage:{
    //         imageDescription: imageDescription,
    //         imageHeight: fileHeight,
    //         imageWidth: fileWidth,
    //         imageName: imageName,
    //         imageUrl: url,
    //         imageType: 3,
    //       },
    //       sectorId: sectorId,
    //       thumbnail:{
    //         imageHeight: image1.height,
    //         imageWidth: image1.width,
    //         imageName: imageName1,
    //         imageUrl: url1,
    //         imageType: 1,
    //       }
    //     });
    //     console.log(result);
    //     //上传至数据库
    //     axios.post('/image/addListImage',result)
    //     .then(res => {
    //       const { code, msg, data } = res.data;
    //       if( code === 0) {
    //         message.success('添加布点图成功！');
    //         console.log('开始关闭！！')
            
    //       }else{
    //         message.info(msg);
    //       }
    //     });       
    //   };
  }
  //根据子项目id获取子项目名称
  GetSectorName() {
    const sectorId = sectorModel.sectorId;
    getSectorName(sectorId).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        const sectorName = data;
        this.setState({ sectorName });
      }
    })
  }
  componentDidMount() {
    this.GetSectorName();
  }
}

export default BindPoint;