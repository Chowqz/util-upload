# **zqz-loading**

> Loading plugin base on vue

## **repository**
https://github.com/Chowqz/zqz-loading

###  **Install**
``` bash
npm install zqz-loading --save
```

### **Usage**
``` bash
import Loading from 'zqz-loading'
```
### Loading.show(options)
#### **options**
show方法的参数
参数|说明|类型|可选值|默认值
-|-|-|-|-
title|提示信息|String|-|''
mask|是否显示透明蒙层，防止触摸穿透|Boolean|true/false|false
``` bash

// 显示加载动画
Loading.show({
    title: "数据加载中",
    mask: true
})
```
### Loading.hide()
```bash
// 需主动调用Loading.hide()才能关闭加载动画
Loading.hide();
```

