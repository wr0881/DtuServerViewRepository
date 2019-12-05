import { observable, toJS, action } from 'mobx';
import { getAllProject,getProjectSector,notSectorMember } from '@/services/project';

class SectorModel {
  @observable projectId = '';
  @observable sectorId = '';
  @observable sectorName = '';

  @observable selectImageId = '';
  @observable selectImageUrl = '';
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
  @observable notBindMemberData = [];

  // 子项目下没有绑定的人员
  @action NotSectorMember = () => {
    let params = { sectorId:this.sectorId }
    notSectorMember(params).then(res => {
      const { code, msg, data } = res.data;
      if(code === 0) {
        this.notBindMemberData = data;
      }else{
        this.notBindMemberData = [];
      }
    }).catch(err => {
      //console.log(err);
    });
  };

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

  // //获取项目下子项目
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