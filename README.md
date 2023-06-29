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

动画初始化，如下所示：
```
<!-- 初始化参数 -->
let option = {
    target: document.getElementById('container'),
    type: 2,
    config: {
        interval: 0.1,
        parseLayer: 2
    }
}

<!-- 调用初始化方法 -->
pageGrow.init(option) 
```
初始化参数说明如下：
| 参 数          | 说 明           |   类 型  | 默认值 |  是否必填 |
| ------------- |:---------------:| :-----:|:-------:|:-------:|
| target          | 动画对象          |  HTMLElement/string  |  | 是 |
| type          | 动画类型，可选类型参考`pageGrow.config` |  number  | 2 | 否 |
| config          | 配置参数          |  object  | {} | 否 |

`config`具体配置参数如下：
| 参 数          | 说 明           |   类 型  | 默认值 |
| ------------- |:---------------| :-----:|-------|
| interval          | 动画间隔          |  number  |  0.02|
| parseLayer          | 解析层数          |  number  |  1|
| bgType          | 背景元素动画效果类型          |  string  |  sys_opacity|
| stringType          | 字符串元素动画效果类型          |  string  |  sys_opacity|
| numberType          | 数字元素动画效果类型          |  string  |  sys_opacity|
| imageType          | 图片元素动画效果类型          |  string  |  sys_opacity|
| svgType          | svg元素动画效果类型          |  string  |  sys_opacity|
| canvasType          | canvas元素动画效果类型          |  string  |  sys_opacity|
| videoType          | video元素动画效果类型          |  string  |  sys_opacity|
| chartType          | 图表元素动画效果类型          |  string  |  sys_opacity|
| leafNodeType          | 叶子元素动画效果类型          |  string  |  sys_opacity|



动画退场，如下所示：
```
pageGrow.leave(reverseCallback, timeScale)
```
其中， `reverseCallback`表示动画退场完成回调函数，`timeScale`表示退场速率。