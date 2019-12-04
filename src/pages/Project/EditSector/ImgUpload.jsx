import React, { Component } from 'react';
import axios from 'axios';
import { Upload, Form, Button, Icon, message } from 'antd';
import { observer } from 'mobx-react';
import { upload } from './upload';

@observer
@Form.create()
class ImgUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div>
                <input multiple type='file' ref='file' />
                <Button onClick={_ => {
                    let file = this.refs.file;
                    let firstFile = file.files[0];
                    let url = `/demo/${firstFile.name}`;
                    upload(url, firstFile, function (err, data) {
                        if(err){
                            message.info('上传失败!');
                            console.log("上传失败!!!");
                        }
                        if(!err){
                            message.success('上传成功');
                        }
                        
                    })
                }}>
                    <Icon type='upload' />上传图片
                </Button>
                <img src='https://monitor-1254331889.cos.ap-guangzhou.myqcloud.com/demo/%E6%97%A0%E6%A0%87%E9%A2%98.png' />
            </div>
        )
    }
}
export default ImgUpload;