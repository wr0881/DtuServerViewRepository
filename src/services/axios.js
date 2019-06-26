import axios from 'axios';

// axios.defaults.baseURL = 'http://123.207.88.210:9093';
// axios.defaults.baseURL = 'http://123.207.88.210:8880'; -- 生产划环境，慎用
axios.defaults.baseURL = 'http://10.88.89.101:8880';
axios.defaults.headers.common['Authorization'] =
  'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqqVspMLFGyMjQ1NTQ2MjK2tNBRSixNUbJSKk9NUtJRSq0ogEmaGIIkS4tTi_wSc1OBKopLC1KLElNyM_OUagEAAAD__w.TRH7E2NyAL2HhXXIbTUwJOEHtzd3NxyWY2WMlnKt-2I';

export default axios;