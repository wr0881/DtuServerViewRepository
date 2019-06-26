import axios from './axios';

/* get终端编号 */
export async function getTerminalNumber() {
    return axios.get('/terminal/listTerminalInUse');
}

/* get传感器编号 */
export async function getSensorNumber() {
    return axios.get('/deviceConfig/listSensorNumber');
}

/* get解析方式 */
export async function getParserMethods() {
    return axios.get('/sensor/getParserMethods');
}

/* get监测类型 */
export async function getMonitorTypes() {
    return axios.get('/sensor/getMonitorTypes');
}

/* get终端类型 */
export async function getTerminalTypes() {
    return axios.get('/terminal/getTerminalTypes');
}

/* get已绑定设备列表信息 */
export async function getDeviceBindList(params) {
    return axios.get('/deviceConfig/getDeviceConfigByCombine', { params });
}