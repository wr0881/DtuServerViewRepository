import axios from './axios';

export async function getSensorInfo(params) {
    return axios.get('/sensor/SensorInfo', { params });
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