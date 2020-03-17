/* eslint-disable*/
import axios from 'axios';
import Cookies from 'js-cookie';
import resModel from './resModel';

const CancelToken = axios.CancelToken;

function getCommonOption() {
  return {
    url: 'http://mng-api-saas.recyclesaas.com/asset/image/upload',
    uploadParams: {
      merchantKey: Cookies.get('merchantKey')
    },
    headers: {
      'Authentication-Token': Cookies.get('token')
    }
  }
}



const EventUtil = {
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  },
  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  }
}

class Upload {
  constructor (el, options = {}) {
    this.parentWrapper = el;
    this.config = Object.assign({
      url: '',
      fileKey: 'file',
      uploadParams: {},
      headers: {},
      accept: '*',
      multiple: false,
      maxSize: Infinity,
      maxNum: Infinity,
      timeout: 60000
    }, getCommonOption(), options);

    this.autoUpload = true;
    this.uploadInput = null;
    this.fileList = [];
    this.isUploading = false;
    this.progressQueue = {};
    this.complete = 0;

    this.uploadImmedCallback = null;
    this.readFileCallback = null;

    this.cancelQueue = [];

    this.init();
  }
  init () {
    const uploadInput = document.createElement('input');
    uploadInput.className = 'uploadInput';
    uploadInput.type = 'file';
    uploadInput.accept = this.config.accept;
    uploadInput.multiple = this.config.multiple;
    uploadInput.style.display = 'none';

    EventUtil.addHandler(uploadInput, 'DOMNodeInserted', e => {
      this.uploadInput = uploadInput;
      this.bindEvent();
    });

    this.parentWrapper.appendChild(uploadInput);
  }
  bindEvent () {
    EventUtil.addHandler(this.uploadInput, 'change', e => {
      this.fileList = Array.prototype.slice.call(e.target.files).map(item => {
        return {
          file: item,
          name: item.name,
          size: item.size,
          ext: item.name.slice(item.name.lastIndexOf('.') + 1)
        };
      });

      if (this.fileList.length > this.config.maxNum) {
        this.callbackHandler(resModel.maxFileNum, null);
        return;
      }

      if (this.fileList.find(item => item.size > this.config.maxSize)) {
        this.callbackHandler(resModel.maxFileSize, null);
        return;
      }

      if (this.autoUpload) {
        this.submitUpload((err, res) => {
          this.callbackHandler(err, res);
        })
      } else {
        this.readFileBatch(this.fileList);
      }
    })
  }
  callbackHandler (err, res) {
    this.uploadImmedCallback && this.uploadImmedCallback(err, res);
    this.readFileCallback && this.readFileCallback(err, res);
  }
  uploadImmed (cb) {
    this.autoUpload = true;
    this.readFileCallback = null;
    this.uploadImmedCallback = cb;
    this.abort();
    this.uploadInput.click();
  }
  uploadDefer (cb) {
    this.autoUpload = false;
    this.uploadImmedCallback = null;
    this.readFileCallback = cb;
    this.abort();
    this.uploadInput.click();
  }
  abort () {
    this.reset();
    this.cancelQueue.map(cancel => {
      cancel(resModel.cancelUpload);
    })
    this.cancelQueue = [];
  }
  readFileBatch (fileList) {
    let promiseArr = [];
    fileList.map(item => {
      promiseArr.push(this.execReadFile(item));
    });
    Promise.all(promiseArr).then(res => {
      this.callbackHandler(null, res);
    }).catch(err => {
      this.callbackHandler(err, null);
    })
  }
  execReadFile (fileItem) {
    return new Promise((resolve, reject) => {
      if (!window.FileReader) {
        reject(resModel.fileReader)
      }

      let isImage = this.isImage(fileItem.ext);
      const fileReader = new FileReader();

      fileReader.onload = e => {
        resolve({
          isImage,
          name: fileItem.name,
          size: fileItem.size,
          ext: fileItem.ext,
          data: e.target.result
        });
      }

      fileReader.onerror = e => {
        reject(e);
      }

      if (isImage) {
        fileReader.readAsDataURL(fileItem.file);
      } else {
        fileReader.readAsText(fileItem.file);
      }
    })
  }
  isImage (ext) {
    let reg = /(png|jpg|gif|jpeg|webp)$/;
    return reg.test(ext);
  }
  uploadFile (fileInfo, index) {
    return new Promise(async (resolve, reject) => {
      const _this = this;

      const headers = Object.assign({
        'Content-Type': 'multipart/form-data'
      }, _this.config.headers);
      const uploadData = new FormData();
      uploadData.append(this.config.fileKey, fileInfo.file);

      for (let k in this.config.uploadParams) {
        uploadData.append(k, this.config.uploadParams[k]);
      }

      axios.post(this.config.url, uploadData, {
        headers: headers,
        onUploadProgress: progressEvent => {
          _this.onUploadProgress(index, progressEvent)
        },
        cancelToken: new CancelToken(function executor (cancel) {
          _this.cancelQueue.push(cancel);
        }),
        timeout: _this.config.timeout
      }).then(res => {
        if (res.data._errCode === '0') {
          resolve({
            url: res.data.url,
            name: fileInfo.name,
            ext: fileInfo.ext,
            size: fileInfo.size
          });
        } else if(res.data._errCode === '110100') {
          reject(resModel.unLogin);
          window.location.replace('/login');
        } 
        else {
          reject({
            errCode: res.data._errCode,
            errMsg: res.data._errStr
          });
        }
      }).catch(err => {
        reject({
          ...resModel.otherError,
          errMsg: err
        })
      })
    })
  }
  submitUpload (cb) {
    if (this.isUploading) {
      cb(resModel.isUploading, null);
      return;
    }

    if (!this.fileList.length) {
      cb(resModel.emptyFileQueue, null);
      return;
    }

    let promiseArr = [];
    this.fileList.map((item, index) => {
      promiseArr.push(this.uploadFile(item, index));
    });

    this.isUploading = true;
    Promise.all(promiseArr).then(res => {
      this.reset();
      this.cancelQueue = [];
      cb && cb(null, res);
    }).catch(err => {
      this.reset();
      this.cancelQueue = [];
      cb && cb(err, null);
    })
  }
  onUploadProgress (requestId, progressEvent) {
    this.progressQueue[requestId] = {
      loaded: progressEvent.loaded,
      total: progressEvent.total
    };
    let loaded = 0;
    let total = 0;
    for (let key in this.progressQueue) {
      loaded += this.progressQueue[key].loaded;
      total += this.progressQueue[key].total;
    }

    this.complete = (loaded / total * 100 | 0);
  }
  reset () {
    this.uploadInput.value = '';
    this.fileList = [];
    this.isUploading = false;
    this.progressQueue = {};
  }
}

export default Upload;
