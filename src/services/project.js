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

/* 获取区间类型 */
export async function getsectorType() {
    return axios.get('/sysCode/getsectorType');
}

/* 获取监测类型 */
export async function listMonitorType() {
    return axios.get('/sysCode/listMonitorType');
}

/* 添加区间 */
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

/* 获取职位信息 */
export async function getMemberType() {
    return axios.get('/sysCode/getMemberType');
}

/* 上传测点图 */
export async function uploadImage(imgFile, params) {
    let param = new FormData();
    param.append('img', imgFile);
    return axios.post(`http://10.88.89.73:8090/upload/uploadImage?sectorId=${params.sectorId}&type=${params.type}&imageName=${params.imageName}&description=${params.description}`, param);
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

/* 获取传感器编号 */
export async function getSersorNumber(params) {
    return axios.get('/sensor/getInstrSensorNumber', { params });
}

/* 人员信息 */
// 获取人员信息
export async function getMemberInfo(params) {
    return axios.get('/member/listMemberInfo', { params });
}
// 增加人员信息
export async function addMemberInfo(body) {
    return axios.post('/member/addMember',body);
}
// 修改人员信息
export async function updateMemberInfo(body) {
    return axios.put('/member/updateMemberInfo' , body);
}
// 删除人员
export async function removeMember(body) {
    return axios.delete('/member/removeMember',{data:body});
}

/* 用户信息 */
// 获取用户信息
export async function getListUser(params) {
    return axios.get('/user/listUser', { params });
}
// 增加用户
export async function addUserInfo(body) {
    return axios.post('/user/addUser', body );
}
// 修改用户信息
export async function updateUser(body) {
    return axios.put('/user/updateUser' , body);
}
// 删除用户
export async function removeUser(param) {
    return axios.delete('/user/removeUser?userId='+param);
}

// 已绑定的区间
export async function getBindSector(params){
    return axios.get('/user/listUserSector',{ params });
}
// 解绑
export async function unbindSector(userId,body){
    return axios.delete('/us/unbind?userId='+userId,{data:body});
}

// 未绑定的区间
export async function getUnbindSector(params){
    return axios.get('/user/listUserNotOwnedSector',{ params });
}
// 绑定
export async function bindingSector(userId,body){
    return axios.post('/us/binding?userId='+userId,body);
}

/* 检测依据 */
// 获取检测依据列表
export async function getListBasis(params) {
    return axios.get('/basis/listBasis', { params });
}
// 增加检测依据
export async function addBasisInfo(body) {
    return axios.post('/basis/addBasis',body);
}
// 修改检测依据
export async function updateBasis(body) {
    return axios.put('/basis/updateBasis' , body);
}
// 删除检测依据
export async function removeBasis(body) {
    return axios.delete('/basis/removeBasis',{data:body});
}