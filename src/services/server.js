import axios from './axios';

// 启动服务
export async function startServer(params) {
    return axios.post('/server/startServer', params);
}

// 停止服务
export async function stopServer(params) {
    return axios.delete('/server/stopServer', params);
}

//  初始化服务button状态
export async function initButtonStatus(params) {
    return axios.delete('/server/stopServer', params);
}

//  获取指定服务数据
export async function getDeviceData(params) {
    return axios.get('/deviceConfig/listDeviceConfigByType',params);
}

//  获取已使用的终端
export async function getTerminal(params) {
    return axios.get('/terminal/listTerminalInUse',params);
}