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
  Upload,
  Spin
} from 'antd';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';
import { upload } from './upload';
import { uploadImage, getSectorName, getListImageUrl } from '@/services/project';
import imageCompression from 'browser-image-compression';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class BindImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      editImageInfo: {},
      previewUrl: '',
      imageType: '',

      drawerVisible: false,
      handleEditImageVisible: false,
      handleEditImageInfoVisible: false,
      handleDeleteImageVisible: false,
      previewVisible: false,

      ImageList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
      },

      getImageListLoading: false,
    };
  }

  handleDrawerVisible = flag => {
    this.setState({ drawerVisible: flag });
  }

  handleEditImageVisible = flag => {
    this.setState({ handleEditImageVisible: flag });
  }

  handleDeleteImageVisible = flag => {
    this.setState({ handleDeleteImageVisible: flag });
  }

  handleEditImageInfoVisible = flag => {
    this.setState({ handleEditImageInfoVisible: flag });
  }

  handleTableChange(pagination) {
    this.setState({ pagination }, this.getImageList.bind(this));
  }

  deleteImage = id => {
    axios.delete(`/image/removeImages?imageListId=${id}`).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getImageList();
      }
    })
  }

  handleSearch = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        this.getImageList(values.type);
      }
    });
  }

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
      <Form layout="inline">
        <FormItem label="图片类型">
          {getFieldDecorator('type')(
            <Select placeholder="请选择图片类型" style={{ width: '200px' }}>
              <Select.Option value="">全部</Select.Option>
              {/* <Select.Option value="1">布点图</Select.Option> */}
              <Select.Option value="现场图">现场图</Select.Option>
              <Select.Option value="剖面图">剖面图</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSearch}>
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
        <FormItem>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            this.handleDrawerVisible(true);
          }}>
            添加图片
          </Button>
        </FormItem>
      </Form>
    );
  }
  render() {
    const columns = [
      {
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: text => (
          <Upload
            //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              //url: `${window.imgAddress}${text}?time=${new Date().toString(32)}`
              url: `${window.imgAddress}${text}?time=${new Date().toString(32)}`
            },]}
            onPreview={_ => { this.setState({ previewVisible: 'true', previewUrl: text }) }}
          // onChange={this.handleChange}
          >
            {/* {fileList.length >= 8 ? null : uploadButton} */}
          </Upload>
        ),
      },
      {
        title: '名称',
        dataIndex: 'imageName',
        key: 'imageName',
      },
      {
        title: '描述',
        dataIndex: 'imageDes',
        key: 'imageDes',
      },
      {
        title: '类型',
        key: 'imageType',
        dataIndex: 'imageType',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              sectorModel.selectImageListId = text.imageListId;
              this.setState({ handleEditImageVisible: true });
              if(text.imageType==='现场图'){
                const imageType = 2;
                this.setState({imageType: imageType});
              }
              if(text.imageType==='剖面图'){
                const imageType = 3;
                this.setState({imageType: imageType});
              }
              
            }}>替换</a>
            <Divider type="vertical" />
            <a onClick={_ => {
              sectorModel.selectImageListId = text.imageListId;
              this.setState({ editImageInfo: text });
              this.setState({ handleEditImageInfoVisible: true });
            }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={_ => {
                this.deleteImage(text.imageListId);
              }}
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
          {this.renderSimpleForm()}
          <Divider />
          <Table loading={this.state.getImageListLoading} dataSource={this.state.ImageList} columns={columns} pagination={{ ...this.state.pagination }} onChange={this.handleTableChange.bind(this)} />
        </Card>

        <AddImg
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
          getImageList={this.getImageList}
        />

        <EditImage
          visible={this.state.handleEditImageVisible}
          handleEditImageVisible={this.handleEditImageVisible}
          getImageList={this.getImageList}
          imageType={this.state.imageType}
        />

        <EditImageInfo
          visible={this.state.handleEditImageInfoVisible}
          handleEditImageInfoVisible={this.handleEditImageInfoVisible}
          getImageList={this.getImageList}
          info={this.state.editImageInfo}
        />

        <Modal visible={this.state.previewVisible} footer={null} onCancel={_ => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={window.imgAddress+this.state.previewUrl} />
        </Modal>
      </Fragment>
    );
  }
  componentDidMount() {
    this.getImageList();
  }
  getImageList = (type) => {
    const { pagination } = this.state;
    this.setState({ getImageListLoading: true });
    axios.get('/image/listImage', {
      params: {
        sectorId: sectorModel.sectorId,
        imageType: type,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
        this.setState({ ImageList: data.list });
      } else {
        this.setState({ ImageList: [] });
      }
      this.setState({ getImageListLoading: false });
    }).catch(err => {
      this.setState({ ImageList: [] });
      this.setState({ getImageListLoading: false });
      console.log(err);
    });
  }
}

@Form.create()
class AddImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgFile: '',

      values: {},
    };
  }

  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let type = values;
        this.setState({ values }, _ => {
          this.refs.addImgUpload.click();
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        //key={Math.random()}
        title="添加图片"
        width={500}
        onClose={_ => { this.props.handleDrawerVisible(false); this.props.getImageList();}}
        visible={this.props.drawerVisible}
      >
        <Form
          layout="vertical"
          // key={Math.random()}
        >
          <Form.Item>
            <div>
            <input multiple type='file' ref='file' name="file" />
            <Button onClick={_ => { this.handleFiles() }} style={{marginTop:'10px'}}>生成缩略图</Button>
            </div>
            <div id="previewtitle" style={{display:'none',marginTop:'20px'}}>缩略图</div>
            <div id="preview"></div>
            <img src="" alt="" id="show" />
          </Form.Item>
          <Form.Item label="图片类型">
            {getFieldDecorator('type', {
              initialValue: 2,
              rules: [{ required: true, message: '请输入图片类型' }],
            })(
              <Select
                placeholder="请选择图片类型"
              >
                <Select.Option value={2}>现场图</Select.Option>
                <Select.Option value={3}>剖面图</Select.Option>
              </Select>
            )}
          </Form.Item>
            
        </Form>
        <Button type='primary' onClick={_ => {
          //子项目id
          //this.handleSubmit;
          this.upLoad();
        }}>上传</Button>
      </Drawer>
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
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if(!err){
        const sectorId = sectorModel.sectorId;
        let file = this.refs.file;
        let firstFile = file.files[0];
        let imageType = firstFile.name.split('.')[1];
        //现场图上传
        if(fieldsValue.type===2){
          let imageUrl = `/images/siteMap/${sectorId}/${Math.random()}.${imageType}`;
          //缩略图
          let imageUrl1 = `/images/siteMap/${sectorId}/${Math.random()}.${imageType}`;

          let imageName = `${this.state.sectorName}现场图`;
          let imageName1 = `${this.state.sectorName}现场缩略图`;
          let imageDescription = `${this.state.sectorName}现场图原图`;
          //读取图片并获取图片宽高
          let reader = new FileReader();
          reader.readAsDataURL(firstFile);
          //上传原图至COS
          upload(imageUrl, firstFile, (err, data) => {
            if(err){
                message.info('现场图原图上传至COS失败!');
            }
            if(!err){
                message.success('现场图原图上传至COS成功');
            }
            
          })
          //上传现场缩略图
          imageCompression(firstFile,{
            maxWidthOrHeight:400
          }).then(tbFile=>{
            //reader.readAsDataURL(tbfile);
            upload(imageUrl1, tbFile, (err, data) => {
              if(err){
                  message.info('现场缩略图上传至COS失败!');
              }
              if(!err){
                  message.success('现场缩略图上传至COS成功');                  
                  this.props.handleDrawerVisible(false); this.props.getImageList();
              }     
            })
          }).catch(e=>{
          })
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
                imageType:fieldsValue.type,
                originalImage:{
                  imageDescription: imageDescription,
                  imageHeight: fileHeight,
                  imageWidth: fileWidth,
                  imageName: imageName,
                  imageUrl: imageUrl,
                  imageType: 3,
                },
                sectorId: sectorId,
                thumbnail:{
                  imageHeight: image1.height,
                  imageWidth: image1.width,
                  imageName: imageName1,
                  imageUrl: imageUrl1,
                  imageType: 1,
                }
              });
              //上传至数据库
              axios.post('/image/addListImage',result)
              .then(res => {
                const { code, msg, data } = res.data;
                if( code === 0) {
                  message.success('添加现场图成功！');
                }else{
                  message.info(msg);
                }
              })
            };
          }         
        }
        //剖面图上传
        if(fieldsValue.type===3){
          let imageUrl = `/images/sectionalView/${sectorId}/${Math.random()}.${imageType}`;
          //缩略图
          let imageUrl1 = `/images/sectionalView/${sectorId}/${Math.random()}.${imageType}`;

          let imageName = `${this.state.sectorName}剖面图`;
          let imageName1 = `${this.state.sectorName}剖面缩略图`;
          let imageDescription = `${this.state.sectorName}剖面图原图`;
          //读取图片并获取图片宽高
          let reader = new FileReader();
          reader.readAsDataURL(firstFile);
          //上传至COS
          upload(imageUrl, firstFile, (err, data) => {
            if(err){
                message.info('剖面图上传至COS失败!');
            }
            if(!err){
                message.success('剖面图上传至COS成功');
            }
            
          })
          //上传剖面缩略图
          imageCompression(firstFile,{
            maxWidthOrHeight:400
          }).then(tbFile=>{
            upload(imageUrl1, tbFile, (err, data) => {
              if(err){
                  message.info('剖面缩略图上传至COS失败!');
              }
              if(!err){
                  message.success('剖面缩略图上传至COS成功');                  
                  this.props.handleDrawerVisible(false); this.props.getImageList();
              }     
            })
          }).catch(e=>{
          })
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
                imageType:fieldsValue.type,
                originalImage:{
                  imageDescription: imageDescription,
                  imageHeight: fileHeight,
                  imageWidth: fileWidth,
                  imageName: imageName,
                  imageUrl: imageUrl,
                  imageType: 3,
                },
                sectorId: sectorId,
                thumbnail:{
                  imageHeight: image1.height,
                  imageWidth: image1.width,
                  imageName: imageName1,
                  imageUrl: imageUrl1,
                  imageType: 1,
                }
              });
              //上传至数据库
              axios.post('/image/addListImage',result)
              .then(res => {
                const { code, msg, data } = res.data;
                if( code === 0) {
                  message.success('添加剖面图成功！');
                }else{
                  message.info(msg);
                }
              })
            };
          }
          
        }        
      }
    })

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

@Form.create()
class EditImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateImageData:''
    };
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="替换图片"
        width={500}
        onClose={_ => { this.props.handleEditImageVisible(false); this.props.getImageList(); }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
          //key={Math.random()}
        >
          <Form.Item>
          <input
            type="file"
            name="file"
            accept=".jpg,.png"
            ref='file'
          />
          <Button onClick={_ => { this.handleFiles() }} style={{marginTop:'10px'}}>生成缩略图</Button>
          <div id="previewtitle" style={{display:'none',marginTop:'20px'}}>缩略图</div>
          <div id="preview"></div>
          <img src="" alt="" id="show" />
          </Form.Item>
          
        </Form>
        <Button type='primary' onClick={_ => {
          this.upLoad();
        }} style={{marginTop:'10px'}}>上传</Button>
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

  //替换图片
  upLoad() {
    //子项目id
    const sectorId = sectorModel.sectorId;
    let file = this.refs.file;
    let firstFile = file.files[0];

    //替换的图片地址保持和原来图片地址一致
    //根据图片listId获取图片地址
    const imageListId = sectorModel.selectImageListId;

    const { form } = this.props;
    getListImageUrl(imageListId).then(res => {
      const { code, msg, data } = res.data;
      if(code===0){
        this.setState({selectImageData:data});
      
        //替换
        if(this.props.imageType===2){
        const selectImageData = this.state.selectImageData;
        let imageUrl = selectImageData[0].imageUrl;
        let imageUrl1 = selectImageData[1].imageUrl;

        let reader = new FileReader();
        reader.readAsDataURL(firstFile);
        //上传替换的图片原图至COS
        upload(imageUrl, firstFile, (err, data)=> {
          if(err){
              message.info('替换原图上传至COS失败!');
          }
          if(!err){
              message.success('替换原图上传至COS成功');
          }
          
        })
        //上传替换现场缩略图
        imageCompression(firstFile,{
          maxWidthOrHeight:400
        }).then(tbFile=>{
          upload(imageUrl1, tbFile, (err, data) => {
            if(err){
                message.info('替换缩略图上传至COS失败!');
            }
            if(!err){
                message.success('替换缩略图上传至COS成功');               
                this.props.handleEditImageVisible(false); this.props.getImageList();
            }     
          })
        }).catch(e=>{
        })
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
            let result = {
              imageType: 2,
              originalImage:{
                imageHeight: fileHeight,
                imageWidth: fileWidth,
                imageListId: imageListId,
                imageType: 3,
              },
              sectorId: sectorId,
              thumbnail:{
                imageHeight: image1.height,
                imageWidth: image1.width,
                imageListId: imageListId,
                imageType: 1,
              }
            };
            //上传至数据库
            axios.post('/image/updateImageInfo',result)
            .then(res => {
              const { code, msg, data } = res.data;
              if( code === 0) {
                message.success('替换图片成功！');
              }else{
                message.info(msg);
              }
            });
          }      
        }
      }
      if(this.props.imageType===3){
        const selectImageData = this.state.selectImageData;
        let imageUrl = selectImageData[0].imageUrl;
        let imageUrl1 = selectImageData[1].imageUrl;

        let reader = new FileReader();
        reader.readAsDataURL(firstFile);
        //上传替换的图片原图至COS
        upload(imageUrl, firstFile, (err, data) => {
          if(err){
              message.info('替换原图上传至COS失败!');
          }
          if(!err){
              message.success('替换原图上传至COS成功');
          }
          
        })
        //上传替换现场缩略图
        imageCompression(firstFile,{
          maxWidthOrHeight:400
        }).then(tbFile=>{
          //reader.readAsDataURL(tbfile);
          upload(imageUrl1, tbFile, (err, data) => {
            if(err){
                message.info('替换剖面图上传至COS失败!');
            }
            if(!err){
                message.success('替换剖面图上传至COS成功');              
                this.props.handleEditImageVisible(false); this.props.getImageList();
            }     
          })
        }).catch(e=>{
        })
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
            let result = {
              imageType: 3,
              originalImage:{
                imageHeight: fileHeight,
                imageWidth: fileWidth,
                imageListId: imageListId,
                imageType: 3,
              },
              sectorId: sectorId,
              thumbnail:{
                imageHeight: image1.height,
                imageWidth: image1.width,
                imageListId: imageListId,
                imageType: 1,
              }
            };
            //上传至数据库
            axios.post('/image/updateImageInfo',result)
            .then(res => {
              const { code, msg, data } = res.data;
              if( code === 0) {
                message.success('替换剖面图成功！');
              }else{
                message.info(msg);
              }
            });
          }      
        }
      }
      }    
    })
  }
}

@Form.create()
class EditImageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgFile: ''
    };
  }

  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        axios.put(`/image/updateImageInfo?imageListId=${sectorModel.selectImageListId}&imageName=${values.imageName}&imageDes=${values.imageDes}`).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('编辑成功');
            this.props.getImageList();
            this.props.handleEditImageInfoVisible(false);
          }
        })
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      info
    } = this.props;
    return (
      <Drawer
        title="编辑图片信息"
        width={720}
        onClose={_ => { this.props.handleEditImageInfoVisible(false) }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="图片名称">
                {getFieldDecorator('imageName', {
                  initialValue: info.imageName ? info.imageName : ''
                })(
                  <Input placeholder="请输入图片名称" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="图片描述">
                {getFieldDecorator('imageDes', {
                  initialValue: info.imageDes ? info.imageDes : ''
                })(
                  <Input placeholder="请输入图片描述" />
                )}
              </FormItem>
            </Col>
          </Row>
          < div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={_ => { this.props.handleDrawerVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer >
    );
  }
}

export default BindImg;