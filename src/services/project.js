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
export async function uploadImage(body) {
    // let param = new URLSearchParams();
    let param = new FormData();
    param.append('img', body.img);
    console.log(param);
    return axios.post(`http://10.88.89.73:8090/upload/uploadImage?sectorId=137&type=1&imageName=1&description=1`,param);
    // return axios.post(`http://123.207.88.210:8180/user/updatePassword?sectorId=137&type=1&imageName=1&description=1`,param);
}

/* 获取终端编号 */
export async function getTerminlaNumber(params) {
    return axios.get('/terminal/getInstrTerminlaNumber', { params });
}

/* 获取传感器编号 */
export async function getSersorNumber(params) {
    return axios.get('/sensor/getInstrSensorNumber', { params });
}