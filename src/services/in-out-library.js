import axios from './axios';

export async function getSensorInfo(params) {
    return axios.get('/sensor/SensorInfo', { params });
}

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

export async function updateInAndOut(params) {
    return axios.put('/sensor/updateSensorPro', params);
}

export async function insertSensors(params) {
    return axios.post('/sensor/insertSensors', params);
}

export async function sensorNumberCount(params) {
    return axios.get('/sensor/sensorNumberCount', { params });
}