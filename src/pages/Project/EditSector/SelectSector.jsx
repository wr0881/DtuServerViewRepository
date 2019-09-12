import React, { Component } from 'react';
import router from 'umi/router';
import { toJS } from 'mobx';
import { Cascader, Card, Button, Select, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAllProject,getProjectSector } from '@/services/project';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';

@observer
class SelectSector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectData:[],
      projectList:[],
      sectorList:[],
      ProjectSectorData:[]
    };
  }
  //获取所有项目
  getAllProject = () => {
    getAllProject().then(res => {
      const { code,msg,data } = res.data;
      //console.log(res.data);
      if(code === 0){
        this.setState({ ProjectData:data });
        //console.log(this.state.ProjectData);
        //this.getProjectSector();
      }else{
        this.setState({ ProjectData:[] });
      }
    }).catch(err => {
      console.log(err);
    })
  }
  
  //获取项目下区间
  getProjectSector = () => {
    let projectId = this.projectId;
    //console.log(this.projectId);
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
    
    return (
      <PageHeaderWrapper title='选择区间'>
        <Card bordered={false}>
          <div style={{
            height: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Select
              size="large" 
              style={{ width: '200px' }} 
              options={options}  
              placeholder="选择项目" 
              onChange={e => {this.projectId=JSON.parse(e);this.getProjectSector();}}
              //value={this.projectId}
            >
              {this.state.ProjectData.map(v => <Select.Option key={v.projectId} value={v.projectId}>{v.projectName}</Select.Option>)}
            </Select>
            <Select
              size="large" 
              style={{ width: '200px',marginLeft: '20px' }} 
              options={options}  
              placeholder="选择区间"
              onChange={e => {this.sectorId=e}} 
            >
              {this.state.ProjectSectorData.map(v => <Select.Option key={v.sectorId} value={v.sectorId}>{v.sectorName}</Select.Option>)}
            </Select>
            <div style={{ paddingLeft: '25px' }}><Button size="large" type='primary' onClick={this.onOk.bind(this)}>确认</Button></div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
  onOk() {
    const { match } = this.props;
    const sectorId = this.sectorId;
    sectorModel.sectorId = sectorId;
    // sectorModel.sectorName = this.sectorName;
    if(sectorId !== undefined){
      router.push('/project/editSector');
    }else{
      message.info('请选择区间！');
    }
    
  }
  componentDidMount(){
    this.getAllProject();
  }
}

export default SelectSector;