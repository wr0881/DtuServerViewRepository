import axios from './axios';
import { formatDate } from 'umi-plugin-locale';
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