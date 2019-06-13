import axios from './axios';

export async function getAllProjectType() {
    return axios.get('/project/getAllProjectType');
}

export async function getAllProject() {
    return axios.get('/project/getAllProject');
}