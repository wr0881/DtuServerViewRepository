import axios from "axios";
import COS from "cos-js-sdk-v5";
import { message } from "antd";
// var COS = require('cos-js-sdk-v5');

var Bucket = 'monitor-1254331889';
var Region = 'ap-guangzhou';
//临时密钥初始化
var cos = new COS({
  // 必选参数
  getAuthorization: function (options, callback) {
    console.log('options:',options);
    axios.get('/image/getKey').then(function (res) {
      const { code,msg,data } = res.data;
      console.log('密钥:',data);
      if(code === 0){
        callback({
          TmpSecretId: data.tmpSecretId,
          TmpSecretKey: data.tmpSecretKey,
          XCosSecurityToken: data.sessionToken,
          ExpiredTime: data.expiredTime,
        });
      }else{
        console.log(msg);
        message.info('上传失败!');
      }     
    }).catch(err => {
      console.log(err);
    })
  }
});

function upload(url, file, callback) {
  cos.putObject({
    Bucket: Bucket,
    Region: Region,
    Key: url,
    Body: file,
    Origin: 'http://zjjlmp.vicp.cc:29823',
    AccessControlRequestMethod: 'PUT',
  }, callback);
}

export {
  upload
}