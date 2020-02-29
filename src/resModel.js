const resModel = {
    unLogin: {
        errCode: '0001',
        errMsg: 'Not login'
    },
    maxFileNum: {
        errCode: '0002',
        errMsg: 'File num can not more than the max file num'
    },
    maxFileSize: {
        errCode: '0003',
        errMsg: 'File size can not more than the max file size'
    },
    isUploading: {
        errCode: '0004',
        errMsg: 'There are files uploading, please don\'t handle repeatedly'
    },
    emptyFileQueue: {
        errCode: '0005',
        errMsg: 'There is no file can be uploaded in queue'
    },
    fileReader: {
        errCode: '0006',
        errMsg: 'The browser is not support FileReader, please update the browser'
    },
    cancelUpload: {
        errCode: '0007',
        errMsg: 'The upload request is canceled'
    },
    otherError: {
        errCode: '0008',
        errMsg: ''
    }
};

export default resModel;
