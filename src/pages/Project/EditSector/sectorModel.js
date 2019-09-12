import { observable, toJS, action } from 'mobx';
import { getAllProject,getProjectSector } from '@/services/project';

class SectorModel {
  @observable projectId = '';
  @observable sectorId = '';

  @observable selectImageId = '';
  @observable selectImageListId = '';
  @observable selectBenchmarkId = '';
  @observable selectBenchmarkPointList = [];
  @observable selectPointInfo = {
    mpId: '',
    benchmarkId: '',
    monitorPointNumber: "",
    monitorTypeName: '',
    picx: '',
    picy: '',
    sensorDeep: '',
    sensorNumber: '',
    terminalChannel: '',
    terminalNumber: '',
  };
  @observable ProjectData = [];
  @observable ProjectSectorData = [];

  //获取所有项目
  // @action getAllProject(){
  //   getAllProject().then(res => {
  //     const { code,msg,data } = res.data;
  //     console.log(res.data);
  //     if(code === 0){
  //       this.ProjectData = data;
  //       console.log(this.ProjectData);
  //       //this.getProjectSector();
  //     }else{
  //       this.ProjectData = [];
  //     }
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }

  // //获取项目下区间
  // @action getProjectSector(){
  //   let projectId = this.projectId;
  //   console.log(this.projectId);
  //   getProjectSector(projectId).then(res => {
  //     const {code,msg,data} = res.data;
  //     console.log(res.data);
  //     if(code === 0){
  //       this.ProjectSectorData = data;
  //     }else{
  //       this.ProjectSectorData = [];
  //     }
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }
}

export default new SectorModel();