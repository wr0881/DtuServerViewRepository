import React, { Component } from 'react';
import router from 'umi/router';
import { toJS } from 'mobx';
import { Cascader, Card, Button, Select, message, Tooltip } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getAllProject,getProjectSector,getSearchProject } from '@/services/project';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import { get } from 'https';

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
        router.push('/user/login');
      }
    }).catch(err => {
      console.log(err);
      
    })
  }
  //模糊查询项目
  getSearchProject = () => {
    const searchProject = this.searchProject;
    console.log(searchProject);
    if(searchProject !== ''){
      getSearchProject(searchProject).then(res => {
        const { code,msg,data } = res.data;
        if(code === 0) {
          this.setState({ ProjectData:data });
        }else{
          this.setState({ ProjectData:[] });
        }
      }).catch(err => {
        console.log(err);      
      })
    }
  }

  //获取项目下子项目
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
      <PageHeaderWrapper title='选择子项目'>
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
              filterOption={false} 
              placeholder="选择项目" 
              onChange={e => {this.projectId=JSON.parse(e);this.getProjectSector();}}
              showSearch
              optionFilterProp="children"              
              //filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0 }
              
              onSearch={v => {
                console.log(v);
                this.searchProject = v;
                if(v !== ''){
                  this.getSearchProject(this.searchProject);
                }else{
                  this.getAllProject();
                }
                
              }}
            >
              {this.state.ProjectData.map(v => <Select.Option key={v.projectId} value={v.projectId}><Tooltip placement="topLeft" title={v.projectName}>{v.projectName}</Tooltip></Select.Option>)}
            </Select>
            <Select
              size="large" 
              style={{ width: '200px',marginLeft: '20px' }} 
              options={options}  
              placeholder="选择子项目"
              onChange={e => {this.sectorId=e}} 
              showSearch
              optionFilterProp="children"
            >
              {this.state.ProjectSectorData.map(v => <Select.Option key={v.sectorId} value={v.sectorId}><Tooltip placement="topLeft" title={v.sectorName}>{v.sectorName}</Tooltip></Select.Option>)}
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
      message.info('请选择子项目！');
    }
    
  }
  componentDidMount(){
    this.getAllProject();
  }
}

export default SelectSector;