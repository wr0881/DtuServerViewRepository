/* eslint-disable */
import axios from './axios';

/* 终端 */
// 获取所有终端
export async function getTerminalInfo(params) {
    return axios.get('/terminal/listTerminal', { params });
}
// 获取终端类型
export async function getTerminalType(params) {
    return axios.get('/terminal/getTerminalTypes', { params });
}
// 添加终端
export async function addTerminals(params) {
    return axios.post('/terminal/batchAddTerminal', params);
}
//获取终端详情
export async function getTerminalDetail(params) {
    return axios.get('/terminal/TerminalDetail', { params });
}
//删除终端
export async function handleDelTerminal(params) {
    return axios.delete('/terminal/removeTerminal', { data: params });
}

/* 传感器 */
//获取传感器信息
export async function getSensorInfo(params) {
    return axios.get('/sensor/SensorInfo', { params });
}
//获取传感器详情
export async function getSensorDetail(params) {
    return axios.get('/sensor/SensorDetail', { params });
}
// 传感器出入库操作
export async function updateInAndOut(params) {
    return axios.put('/sensor/updateSensorPro', params);
}
// 批量添加传感器
export async function insertSensors(params) {
    return axios.post('/sensor/insertSensors', params);
}
// 删除传感器
export async function handleDelSensor(params) {
    return axios.delete('/sensor/removeSensor', { data: params });
}
// 修改传感器
export async function handleModifySensor(params) {
    return axios.put('/sensor/modifySensor', { params });
}

export async function sensorNumberCount(params) {
    return axios.get('/sensor/sensorNumberCount', { params });
}