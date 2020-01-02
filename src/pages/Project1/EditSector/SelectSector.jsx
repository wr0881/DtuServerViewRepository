import React, { Component } from 'react';
import router from 'umi/router';
import { toJS } from 'mobx';
import { Cascader, Card, Button, Select, message, Tooltip, Popconfirm, Form, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAllProject,getProjectSector,getSearchProject,removeProject,removeSector } from '@/services/project';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import { get } from 'https';

@observer
@Form.create()
class SelectSector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectData:[],
      projectList:[],
      sectorList:[],
      ProjectSectorData:[],

      sectorId:''
    };
  }
  //获取所有项目
  getAllProject = () => {
    let params = {
      isManual: true,
      projectKeyword: this.searchProject
    }
    getAllProject(params).then(res => {
      const { code,msg,data } = res.data;
      if(code === 0){
        this.setState({ ProjectData:data });
      }else{
        this.setState({ ProjectData:[] });
        router.push('/user/login');
      }
    }).catch(err => {
      console.log(err);
      
    })
  }


  //删除项目
  handleDelProject = (record) => {
    //项目id(sectorId)
    const { form } = this.props;
    let param = record;
    removeProject(param).then(res => {
      let result = res.data;
      if (result.code === 0) {
        message.success('删除项目成功!');
        form.resetFields();
      } else {
        message.info('删除项目失败!');
      }
    }).catch(err => {
      message.error(err);
    })
  }

  //删除子项目
  handleDelSector = (record) => {
    //项目id(projectId)
    const { form } = this.props;
    let param = record;
    removeSector(param).then(res => {
      let result = res.data;
      if (result.code === 0) {
        message.success('删除子项目成功!');
        this.setState({ ProjectSectorData:[] });
        form.resetFields()
      } else {
        message.info('删除子项目失败!');
      }
    }).catch(err => {
      message.error(err);
    })
  }
  
  //获取项目下子项目
  getProjectSector = () => {
    let projectId = this.projectId;
    getProjectSector(projectId).then(res => {
      const {code,msg,data} = res.data;
      //console.log(res.data);
      if(code === 0){
        this.setState({ ProjectSectorData:data });
        //console.log(this.state.ProjectSectorData);
      }else{
        this.setState({ ProjectSectorData:[] });
      }
    }).catch(err => {
      console.log(err);
    })
  }
  render() {
    const options = [];
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper title='选择子项目'>
        <Card bordered={false}>
          <div style={{
            height: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Form>
              <Row gutter={{ md: 8, lg: 24, xl: 48}}>
                <Col md={10} sm={24} style={{paddingLeft:'0px',paddingRight:'0px'}}>
                  <Form.Item>
                    {getFieldDecorator('project')(
                      <Select
                        size="large" 
                        //value={this.projectId}
                        style={{ width: '300px' }} 
                        options={options} 
                        filterOption={false} 
                        placeholder="选择项目" 
                        onChange={e => {this.projectId=JSON.parse(e);this.getProjectSector();}}
                        showSearch
                        optionFilterProp="children"  
                        optionLabelProp="label"            
                        onSearch={v => {
                          this.searchProject = v;
                          this.getAllProject();
                          
                        }}
                      >
                        {this.state.ProjectData.map(v => 
                          <Select.Option key={v.projectId} value={v.projectId} label={v.projectName}><Tooltip placement="topLeft" title={v.projectName}>{v.projectName}</Tooltip>
                          <Popconfirm
                            title={`确定删除项目`+v.projectName+`?`}
                            onConfirm={()=>
                              this.handleDelProject(v.projectId)
                            }
                          >
                            <a style={{float:'right'}}>删除</a>
                          </Popconfirm>
                          </Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={10} sm={24} style={{paddingLeft:'0px',paddingRight:'0px'}}>
                  <Form.Item>
                    {getFieldDecorator('sector')(
                      <Select
                        size="large" 
                        // value={this.sectorId}
                        style={{ width: '300px',marginLeft: '20px' }} 
                        options={options}  
                        placeholder="选择子项目"
                        filterOption={false}
                        onChange={e => {this.sectorId=JSON.parse(e)}} 
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
          
                      >
                        {this.state.ProjectSectorData.map(v => 
                          <Select.Option key={v.sectorId} value={v.sectorId} label={v.sectorName}><Tooltip placement="topLeft" title={v.sectorName}>{v.sectorName}</Tooltip>
                          <Popconfirm
                            title={`确定删除子项目`+v.sectorName+`?`}
                            onConfirm={()=>
                              this.handleDelSector(v.sectorId)
                            }
                          >
                            <a style={{float:'right'}}>删除</a>
                          </Popconfirm>
                          </Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} sm={24}>
                  <div style={{ paddingLeft: '25px' }}><Button size="large" type='primary' onClick={this.onOk.bind(this)}>确认</Button></div>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
  onOk() {
    const { match } = this.props;
    const sectorId = this.sectorId;
    const projectId = this.projectId;
    sectorModel.sectorId = sectorId;
    sectorModel.projectId = projectId;
    if(sectorId !== undefined){
      router.push('/project1/editSector');
    }else{
      message.info('请选择子项目！');
    }
    
  }
  componentDidMount(){
    this.getAllProject();
  }
}

export default SelectSector;