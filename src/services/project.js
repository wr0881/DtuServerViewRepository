import axios from './axios';
import { formatDate } from 'umi-plugin-locale';
import { async } from 'q';
// import postParams from '@/utils/postParams';

/* 添加项目 */
export async function addProject(body) {
    return axios.post('/project/addProject', body);
}

export async function getAllProjectType() {
    return axios.get('/project/getAllProjectType');
}

export async function getAllProject() {
    return axios.get('/project/getAllProject');
}

//模糊查询项目
export async function getSearchProject(projecKeyWord) {
    return axios.get('/project/getInstrProject?projecKeyWord=' + projecKeyWord);
}

/* 获取子项目类型 */
export async function getsectorType() {
    return axios.get('/sysCode/getsectorType');
}

/* 获取监测类型 */
export async function listMonitorType() {
    return axios.get('/sysCode/listMonitorType');
}

/* 添加子项目 */
export async function addSector(body) {
    return axios.post('/monitorPoint/addSector', body);
}

/* 添加联系人 */
export async function addSectorMember(body) {
    return axios.post('/monitorPoint/addSectorMember', body);
}

/* 搜索联系人 */
export async function getInstrMemberInfo(params) {
    return axios.get('/monitorPoint/getInstrMemberInfo', { params });
}

/* 添加联系人 */
export async function addMember(body) {
    return axios.post('/member/addMember', body);
}

/* 查看联系人是否存在 */
export async function getCountMemberInfo(params) {
    return axios.get('/monitorPoint/getCountMemberInfo', { params });
}

/* 获取职位信息 */
export async function getMemberType() {
    return axios.get('/sysCode/getMemberType');
}

/* 上传测点图 */
export async function uploadImage(imgFile, params) {
    let param = new FormData();
    param.append('img', imgFile);
    return axios.post(`${window.uploadImgAddress}/upload/uploadImage?sectorId=${params.sectorId}&type=${params.type}&imageName=${params.imageName}&description=${params.description}`, param);
}

/* 上传测点信息 */
export async function addMonitorPoint(json) {
    return axios.post('/monitorPoint/addMonitorPoint', json, {
        headers: { 'Content-Type': 'application/json' },
        // body: json
    });
}

/* 获取终端编号 */
export async function getTerminlaNumber(params) {
    return axios.get('/terminal/getInstrTerminlaNumber', { params });
}

export async function getTerminlaNumber1(params) {
    return axios.get('/terminal/getInstrTerminlaNumberNotBoundProject', { params });
}

/* 获取传感器编号 */
export async function getSersorNumber(params) {
    return axios.get('/sensor/getInstrSensorNumber', { params });
}

export async function getSersorNumber1(params) {
    return axios.get('/sensor/getInstrSensorNumberNotBoundProject', { params });
}

/* 人员信息 */
// 获取人员信息
export async function getMemberInfo(params) {
    return axios.get('/member/listMemberInfo', { params });
}
// 增加人员信息
export async function addMemberInfo(body) {
    return axios.post('/member/addMember', body);
}
// 修改人员信息
export async function updateMemberInfo(body) {
    return axios.put('/member/updateMemberInfo', body);
}
// 删除人员
export async function removeMember(body) {
    return axios.delete('/member/removeMember', { data: body });
}

/* 用户信息 */
// 获取用户信息
export async function getListUser(params) {
    return axios.get('/user/listUser', { params });
}
// 增加用户
export async function addUserInfo(body) {
    return axios.post('/user/addUser', body);
}
// 修改用户信息
export async function updateUser(body) {
    return axios.put('/user/updateUser', body);
}
// 删除用户
export async function removeUser(param) {
    return axios.delete('/user/removeUser?userId=' + param);
}

//用户唯一性验证
// export async function checkOnlyUser(param) {
//     return axios.get('/user/checkOnlyUser',{ param })
// }


// 已绑定的子项目
export async function getBindSector(params) {
    return axios.get('/user/listUserSector', { params });
}
// 解绑
export async function unbindSector(userId, body) {
    return axios.delete('/us/unbind?userId=' + userId, { data: body });
}

// 未绑定的子项目
export async function getUnbindSector(params) {
    return axios.get('/user/listUserNotOwnedSector', { params });
}
// 绑定未绑定的子项目
export async function bindingSector(userId, body) {
    return axios.post('/us/binding?userId=' + userId, body);
}

// 未绑定的项目
export async function getUnbindProject(params) {
    return axios.get('/binding/listProjectNotInUser', { params });
}
// 绑定未绑定的项目
export async function bindingProject(userId, body) {
    return axios.post('/us/bindingProject?userId=' + userId, body);
}

/* 监测依据 */
// 获取监测依据列表
export async function getListBasis(params) {
    return axios.get('/basis/listBasisNew', { params });
}
// 增加监测依据
export async function addBasisInfo(body) {
    return axios.post('/basis/addBasisNew', body);
}
// 修加监测依据
export async function updateBasis(body) {
    return axios.put('/basis/updateBasisNew', body);
}
// 删加监测依据
export async function removeBasis(body) {
    return axios.delete('/basis/removeBasis', { data: body });
}

/* 子项目管理 */
// 选择子项目
// 获取所有项目(已有)
// 获取项目下子项目
export async function getProjectSector(projectId) {
    return axios.get('/sector/getSectorByProId?projectId=' + projectId);
}
// 子项目下绑定人员信息
export async function getBindingMember(params) {
    return axios.get('/binding/sectorMember', { params });
}
// 子项目下没有绑定的人员信息
export async function notSectorMember(params) {
    return axios.get('/binding/notSectorMember', { params })
}
// 删除子项目绑定人员关系
export async function removeSectorMember(body) {
    return axios.delete('/binding/removeSectorMember', { data: body });
}
// 新增子项目和人员绑定关系
export async function addUnbindMember(sectorId, body) {
    return axios.post('/binding/addSectorMember?sectorId=' + sectorId, body);
}

// 子项目下绑定监测依据信息
export async function getBindingMonitorBasis(params) {
    return axios.get('/binding/listSectorMoniBasNew', { params });
}
// 子项目下没有绑定的监测依据信息
export async function notSectorMoniBas(params) {
    return axios.get('/binding/listNotSectorMoniBasNew', { params });
}
// 删除监测依据和子项目的绑定关系
export async function removeBindingMoniBas(body) {
    return axios.delete('/binding/removeSectorMoniBasis', { data: body });
}
// 添加子项目监测依据关系
export async function addSectorMoniBas(sectorId, body) {
    return axios.post('/binding/addSectorMoniBasis?sectorId=' + sectorId, body);
}

// 根据子项目id获取子项目名称
export async function getSectorName(sectorId) {
    return axios.get('/sector/getSectorName?sectorId=' + sectorId);
}
