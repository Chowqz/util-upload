<template>
    <div id="app">
        <div ref="uploadBox" class="uploadBox">
            <button class="upload-btn" @click="uploadImmed">选择文件并上传</button>
            <button class="upload-btn" @click="uploadDefer">选择文件只预览</button>
            <button class="upload-btn" @click="submitUpload">确认提交上传</button>
            <button class="upload-btn" @click="abort">停止上传</button>
            <button class="upload-btn" @click="clearPicList">清空图片列表</button>
            <div>上传进度： {{uploadInstance ? uploadInstance.complete : 0}}%</div>
        </div>
        <ul class="pic-list">
            <li class="pic-item" v-for="(item, index) in picList" :key="index">
                <img class="preview-img" :src="item.url">
            </li>
        </ul>
    </div>
</template>
<script>
import './reset.css';
// import Upload from '../src/index.js'
// import Upload from '../dist/util-upload.js'
const Upload = require('../dist/util-upload.js');

export default {
    data() {
        return {
            uploadInstance: null,
            picList: [],
            progress: 0
        }
    },
    created() {
        
    },
    mounted() {
        this.uploadInstance = new Upload(this.$refs.uploadBox, {
            url: 'http://localhost:3456/upload',
            fileKey: 'file',
            uploadParams: {
                merchantCode: '123456'
            },
            accept: 'image/*',
            multiple: true,
            maxNum: 2,
            maxSize: 102400000,
            timeout: 10000
        });
    },
    methods: {
        uploadImmed() {
            this.uploadInstance.uploadImmed((err, res) => {
                if (err) {
                    console.log('uploadImmed:' + err);
                    return;
                }
                console.log(res);
                this.picList = res.map(item => {
                    return {
                        name: item.name,
                        url: item.url
                    }
                })
            });
        },
        uploadDefer() {
            this.uploadInstance.uploadDefer((err, res) => {
                if (err) {
                    console.log('uploadDefer:' + err);
                    return;
                }
                console.log(res);
                this.picList = res.map(item => {
                    return {
                        name: item.name,
                        url: item.data
                    }
                })
            });
        },
        submitUpload() {
            this.uploadInstance.submitUpload((err, res) => {
                if (err) {
                    console.log('submitUpload:' + err);
                    return;
                }
                console.log(res);
                this.picList = res.map(item => {
                    return {
                        name: item.name,
                        url: item.url
                    }
                })
            });
        },
        abort() {
            this.uploadInstance.abort();
        },
        clearPicList() {
            this.picList = [];
        }
    },
    watch: {
        'uploadInstance.complete': function(newVal, oldVal) {
            this.progress = newVal;
        }
    }
}

</script>
<style scoped>
html, body, #app{
    height: 100%;
    overflow: hidden;
}
#app{
    display: flex;
}
.uploadBox{
    width: 200px;
    padding: 30px 15px;
    box-sizing: border-box;
    border-right: 1px solid #fabe00;
}
.upload-btn{
    display: block;
    width: 100%;
    height: 36px;
    color: #fff;
    background-color: #fabe00;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 15px;
}
.pic-list{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 100%;
    padding: 20px;
}
.pic-item{
    width: 300px;
    height: 300px;
    border: 1px solid #ddd;
    margin-left: 20px;
    margin-bottom: 20px;
}
.preview-img{
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

</style>
