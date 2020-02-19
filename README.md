# **util-upload**

> A upload plugin

### **Usage**
``` bash
import Upload from '../src/index.js'
```
### **Init**
```bash
<div id="uploadBox"></div>

//  vue中使用时注意dom渲染完成后中，再初始化实例对象
const uploadInstance = new Upload(document.getElementById("uploadBox"), {
    url: 'http://localhost:3456/upload',
    fileKey: 'file',
    uploadParams: {
        merchantCode: '123456'
    },
    accept: 'image/*',
    autoUpload: false,
    multiple: true,
    maxNum: 2,
    maxSize: 102400000
});
```

### **Options**

参数|说明|类型|必选|可选值|默认值
-|-|-|-|-|-
url|上传的url链接|String|是|-|''
fileKey|上传的文件键名|String|否|-|file
uploadParams|上传时传给后端的其他参数|Object|否|-|{}
accept|支持接受的文件类型，同原生input的accept属性|String|否|同原生input的accept属性|*
multiple|是否支持文件多选上传|Boolean|否|true/false|false
maxNum|限制的最大文件个数|Number|否|-|Infinity
maxSize|限制的最大文件大小（单位字节）|Number|否|-|Infinity

#### 选择文件并上传
```bash
// 调用实例方法uploadImmed
uploadInstance.uploadImmed((err, res) => {
	if (err) {
		console.log('uploadImmed:' + err);
		return;
	}
	console.log(res);
})

// res返回结果
[{
	url: "http://localhost:3456/P80804-192532-1582089100283.jpg"
	name: "P80804-192532.jpg"
	ext: "jpg"
	size: 2638003
}]
```

#### 选择文件先预览，然后再上传
```bash
// 实例方法uploadDefer选择文件并读取文件信息
uploadInstance.uploadDefer((err, res) => {
	if (err) {
		console.log('uploadDefer:' + err);
		return;
	}
	console.log(res);
})

// res返回的结果
// 图片文件返回的信息，读取为base64，可用于预览
[{
    isImage: true
    name: "P80804-192532.jpg"
    size: 2638003
    ext: "jpg"
    data: 'data:image/jpeg;base64,/....'
}]

// 或者非图片文件，读取为文本信息
[{
    isImage: false
    name: "index.html"
    size: 11
    ext: "html"
    data: "hello world"
}]


// 再次调用实例方法submitUpload直接上传文件
uploadInstance.submitUpload((err, res) => {
	if (err) {
		console.log('submitUpload:' + err);
		return;
	}
	console.log(res);
})
// res返回结果
[{
	url: "http://localhost:3456/P80319-190143-1582089625020.jpg"
	name: "P80319-190143.jpg"
	ext: "jpg"
	size: 2179371
}]
```

#### 终止上传
```bash
// 调用实例方法abort
uploadInstance.abort();
// 终止上传请求后会在uploadImmed或者submitUpload的回调里抛出错误
```

#### 上传进度
```bash
// 访问实例属性complete获取上传进度（值0~100，如果一次选择多个文件，该进度是总的进度）
uploadInstance.complete
```


