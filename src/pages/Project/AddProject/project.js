import { observable } from 'mobx';

class Project {
  @observable projectId = 137;
  @observable sectorId = 162;
}

export default new Project();