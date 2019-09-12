import { observable } from 'mobx';

class SectorModel {
  @observable sectorId = 21;
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
}

export default new SectorModel();