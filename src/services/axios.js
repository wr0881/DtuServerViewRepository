/* eslint-disable dot-notation */
import axios from 'axios';

// axios.defaults.baseURL = 'http://123.207.88.210:9093'; // 测试环境
// axios.defaults.baseURL = 'http://10.88.89.101:8880'; //邓泽民
// axios.defaults.baseURL = 'http://10.88.89.170:8880'; //徐善斌
// axios.defaults.baseURL = 'http://10.88.89.73:8880'; //李茂平
axios.defaults.baseURL = 'http://10.88.89.224:8880'; // 蒋雄威
// axios.defaults.headers.common['Authorization'] =
//   'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqqVspMLFGyMjQ1NTQ2MjK2tNBRSixNUbJSKk9NUtJRSq0ogEmaGIIkS4tTi_wSc1OBKopLC1KLElNyM_OUagEAAAD__w.TRH7E2NyAL2HhXXIbTUwJOEHtzd3NxyWY2WMlnKt-2I';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export default axios;