# page-grow
页面进出场动画管理，零配置，高扩展，是可视化大屏或其他要求炫酷的商业网站必备插件。

## Install

```
npm i page-grow
```
## Usage

```
import {pageGrow} from 'page-grow'
```


### option
| 参 数          |说 明           |   类 型  | 默认值 |  是否必填 |
| ------------- |---------------|-----|-------|-------|
| target          | 动画对象          |  HTMLElement/string  | - | 是 |
| type          | 动画类型，可选类型参考[option.type](#optiontype) |  number  | 2 | 否 |
| parseLayer          | 解析层数。v0.2.1+支持 |  number | 1 | 否 |
| interval          | 解析层数。v0.2.1+支持 | number  | 0.02 | 否 |
| adjustTlDur          | 是否调整入场动画时长。v0.2.1+支持 |  boolean  | true | 否 |
| config          | 配置参数，每种`type`都有对应的一套默认配置。<br/> 详细配置参考[option.config](#optionconfig)         |  object  | {} | 否 |

#### option.type
|类型          | 含义          | 说明          |
|---------------|:---------------|:---------------|
| 2          |  向下渐显          |从上到下元素`透明度`由0到元素初始透明度 |
| 3          |  向下展开          |从上到下元素`高度`由0到元素初始高度|
| 4          |  向下放大          |从上到下元素`缩放`由0到元素初始缩放值|
| 5          |  向右渐显          |从左到右元素`透明度`由0到元素初始透明度 |
| 6          |  向右展开          |从左到右元素`宽度`由0到元素初始宽度 |
| 7          |  向右放大          |从左到右元素`缩放`由0到元素初始缩放值 |
| 8          |  向右下渐显        |从左上到右下元素`透明度`由0到元素初始透明度 |
| 9          |  向右下放大        |从左上到右下元素`缩放`由0到元素初始缩放值 |
| 10          |  向右下横向展开    |从左上到右下元素`宽度`由0到元素初始宽度 |
| 11          |  向右下纵向展开    |从左上到右下元素`高度`由0到元素初始高度 |


#### option.config
| 参 数          | 说 明           |   类 型  | 默认值 |
| ------------- |---------------| -----|-------|
| interval          | 动画间隔。覆盖`option.interval`          |  number  |  0.02|
| parseLayer          | 解析层数。覆盖`option.parseLayer`           |  number  |  1|
| bgType          | 背景元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4          |  string  |  sys_opacity|
| stringType| 字符串元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4、6、7 |  string  | sys_opacity|
| numberType| 数字元素动画效果类型 <br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4、5 |  string|  sys_opacity|
| imageType | 图片元素动画效果类型 <br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4         |  string  |  sys_opacity|
| svgType  | svg元素动画效果类型 <br/>可选值有[bgtype](#optionconfigbgtype)中的1         |  string  |  sys_opacity|
| canvasType | canvas元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1         |  string  |  sys_opacity|
| videoType  | video元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4          |  string  |  sys_opacity|
| chartType  | 图表元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4          |  string  |  sys_opacity|
| leafNodeType  | 叶子元素动画效果类型<br/>可选值有[bgtype](#optionconfigbgtype)中的1、2、3、4          |  string  |  sys_opacity|

#### option.config.bgType
| 序号 | 类型          | 说 明           |
| ------------- | ------------- |---------------|
| 1 | sys_opacity   | 元素透明度由0到初始透明度 |       
| 2 | sys_scale   | 元素缩放由0到初始缩放值 |       
| 3 | sys_height   | 元素高度由0到初始高度 |       
| 4 | sys_width   | 元素宽度由0到初始宽度 |       
| 5 | sys_number   | 数字递增动画 |       
| 6 | sys_stringWave   | 字符串wave动画 |       
| 7 | sys_stringPrint   | 字符串打印动画 |       

### 方法
| 名称          | 说明           |   参数  |
| ------------- |:---------------|:-----|
| init()          | 动画初始化          | [option](#option)  |
| leave()          | 动画退场          | `reverseCallback`：动画退场完成回调函数<br/>`timeScale`：退场动画速率，默认为2。  |


动画初始化示例，如下所示：
```
// 初始化参数
let option = {
    target: document.getElementById('container'),
    type: 2,
    config: {
        interval: 0.1,
        parseLayer: 2
    }
}

// 调用初始化方法
pageGrow.init(option) 
```


动画退场示例，如下所示：
```
// 退场完成回调函数
function reverseCallback(){console.log('动画退场完成')}

// 调用退场方法
pageGrow.leave(reverseCallback, 1.6)
```
