import React, { Component } from 'react';
import axios from 'axios';
import { Upload, Form, Button, Icon, message } from 'antd';
import { observer } from 'mobx-react';
import { upload } from './upload';
import sectorModel from './sectorModel';

@observer
@Form.create()
class ImgUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            fileList: [],
            formData: {}
        }
    }

    componentDidMount(){
    }

    render(){
        
        return(
            <Upload
                multiple
                customRequest={files => {
                    const { file, onProgress, onSuccess, onError } = files;
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('sectorId', sectorModel.sectorId);
                    formData.append('type', 1);
                    this.setState({formData:formData});
                    console.log('file:',file);
                    console.log('formData:',this.state.formData);
                    
                }}
                listType="picture"
            >
                <Button>
                    <Icon type="upload" />上传图片
                </Button>
            </Upload>
        )
    }
}
export default ImgUpload;