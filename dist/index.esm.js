import { gsap } from 'gsap';
export { gsap } from 'gsap';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * 动画对象类型
 */
var EGrowElementType;
(function (EGrowElementType) {
    EGrowElementType[EGrowElementType["number"] = 0] = "number";
    EGrowElementType[EGrowElementType["string"] = 1] = "string";
    EGrowElementType[EGrowElementType["image"] = 2] = "image";
    EGrowElementType[EGrowElementType["chart"] = 3] = "chart";
    EGrowElementType[EGrowElementType["none"] = 4] = "none";
    EGrowElementType[EGrowElementType["svg"] = 5] = "svg";
    EGrowElementType[EGrowElementType["bg"] = 6] = "bg";
    EGrowElementType[EGrowElementType["video"] = 7] = "video";
    EGrowElementType[EGrowElementType["canvas"] = 8] = "canvas";
    EGrowElementType[EGrowElementType["bgString"] = 9] = "bgString";
    EGrowElementType[EGrowElementType["bgNumber"] = 10] = "bgNumber";
    EGrowElementType[EGrowElementType["style"] = 11] = "style";
    EGrowElementType[EGrowElementType["leafNode"] = 12] = "leafNode";
    //...
})(EGrowElementType || (EGrowElementType = {}));
var EGrowElementTime;
(function (EGrowElementTime) {
    EGrowElementTime[EGrowElementTime["number"] = 0.3] = "number";
    EGrowElementTime[EGrowElementTime["string"] = 0.3] = "string";
    EGrowElementTime[EGrowElementTime["image"] = 0.3] = "image";
    EGrowElementTime[EGrowElementTime["chart"] = 0.2] = "chart";
    EGrowElementTime[EGrowElementTime["none"] = 0] = "none";
    EGrowElementTime[EGrowElementTime["svg"] = 0.3] = "svg";
    EGrowElementTime[EGrowElementTime["bg"] = 0.3] = "bg";
    EGrowElementTime[EGrowElementTime["audio"] = 0.3] = "audio";
    EGrowElementTime[EGrowElementTime["video"] = 0.3] = "video";
    EGrowElementTime[EGrowElementTime["canvas"] = 0.2] = "canvas";
    EGrowElementTime[EGrowElementTime["bgString"] = 0.3] = "bgString";
    EGrowElementTime[EGrowElementTime["bgNumber"] = 0.3] = "bgNumber";
    //...
})(EGrowElementTime || (EGrowElementTime = {}));
// 字符串动画类型
var StringGrowType;
(function (StringGrowType) {
    StringGrowType[StringGrowType["wave"] = 1] = "wave";
    StringGrowType[StringGrowType["print"] = 2] = "print";
})(StringGrowType || (StringGrowType = {}));

/**
 * 解析器抽象类
 */
var AbstractParser = /** @class */ (function () {
    function AbstractParser() {
    }
    return AbstractParser;
}());
/**
 * 解析HTML页面元素
 */
var HTMLPageParser = /** @class */ (function (_super) {
    __extends(HTMLPageParser, _super);
    function HTMLPageParser(rule) {
        var _this = _super.call(this) || this;
        _this._els = Array();
        _this._rule = rule;
        return _this;
    }
    Object.defineProperty(HTMLPageParser.prototype, "rule", {
        get: function () {
            return this._rule;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLPageParser.prototype, "elements", {
        get: function () {
            return this._els;
        },
        enumerable: false,
        configurable: true
    });
    HTMLPageParser.prototype.dispose = function () {
        this._els.length = 0;
    };
    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param opt 配置参数
     * @returns IGrowHTMLElement数组
     */
    HTMLPageParser.prototype.parse = function (opt) {
        this._option = opt;
        this._parseLayer = 0;
        //初始化所有元素基础信息
        this._els = this._parseHTMLElementNew(opt.target);
        //通过规则重新排序
        this._rule.exec(this._els);
        return this._els;
    };
    /**
     * 获取元素集合
     * @param element 传入的动画元素
     * @returns
     */
    HTMLPageParser.prototype._parseHTMLElementNew = function (element) {
        this._parseLayer++;
        var element_x = element.getBoundingClientRect().left, element_y = element.getBoundingClientRect().top, element_centerX = element_x + element.offsetWidth / 2, element_centerY = element_y + element.offsetHeight / 2, element_info = [];
        var el = this._getElement(element, element_x, element_y, element_centerX, element_centerY);
        var isParse = this._isParse(el);
        if (isParse) {
            el.children = this._parseHTMLElementRecurve(element);
        }
        element_info.push(el);
        return element_info;
    };
    /**
     * 递归获取元素集合
     * @param element 传入的动画元素
     * @returns
     */
    HTMLPageParser.prototype._parseHTMLElementRecurve = function (element) {
        var _a, _b;
        this._parseLayer++;
        var element_child = element.children, element_x = element.getBoundingClientRect().left, element_y = element.getBoundingClientRect().top, element_info = [];
        for (var i = 0; i < element_child.length; i++) {
            // 针对dev平台模块辅助线dom忽略
            if (element_child[i].className.toString().includes("handle handle-")) {
                break;
            }
            // 针对页面script标签忽略
            if (element_child[i].nodeName == 'SCRIPT') {
                break;
            }
            var x = element_child[i].getBoundingClientRect().left - element_x;
            var y = element_child[i].getBoundingClientRect().top - element_y;
            var w = (_a = element_child[i].offsetWidth) !== null && _a !== void 0 ? _a : element_child[i].scrollWidth;
            var h = (_b = element_child[i].offsetHeight) !== null && _b !== void 0 ? _b : element_child[i].scrollHeight;
            var centerX = x + w / 2;
            var centerY = y + h / 2;
            var el = this._getElement(element_child[i], x, y, centerX, centerY);
            var child = [], isParse = this._isParse(el);
            if (element_child[i].children.length && isParse) {
                child = this._parseHTMLElementRecurve(element_child[i]);
            }
            el.children = child;
            element_info.push(el);
        }
        return element_info;
    };
    /**
     * 获取元素对象
     * @param el 元素
     * @param x 元素位置x
     * @param y 元素位置y
     * @param centerX 元素中心点坐标x
     * @param centerY 元素中心点坐标y
     * @returns
     */
    HTMLPageParser.prototype._getElement = function (el, x, y, centerX, centerY) {
        var _a, _b, _c, _d, _e, _f, _g;
        // 当元素宽/高未设置为0时， 设置为相对定位，获取宽/高
        var w = Number(window.getComputedStyle(el).width.replace("px", "")) || el.offsetWidth, h = Number(window.getComputedStyle(el).height.replace("px", "")) || el.offsetHeight;
        if (!(w && h)) {
            el.style.position = 'relative';
            w = el.scrollWidth;
            h = el.scrollHeight;
        }
        // 获取元素transform原始数值，因为动画是基于opacity、scale属性设置
        var transformStr = window.getComputedStyle(el).transform;
        var transformArr = [], scaleX = 1, scaleY = 1;
        if (transformStr != 'none') {
            if (transformStr.indexOf("matrix") > -1) {
                transformArr = transformStr.substring(7).replace(")", "").split(",");
                scaleX = (_a = Number(transformArr[0])) !== null && _a !== void 0 ? _a : 1;
                scaleY = (_b = Number(transformArr[3])) !== null && _b !== void 0 ? _b : 1;
            }
            if (transformStr.indexOf("scale") > -1) {
                transformArr = transformStr.substring(6).replace(")", "").split(",");
                if (transformArr.length > 1) {
                    scaleX = (_c = Number(transformArr[0])) !== null && _c !== void 0 ? _c : 1;
                    scaleY = (_d = Number(transformArr[3])) !== null && _d !== void 0 ? _d : 1;
                }
                else {
                    scaleX = (_e = Number(transformArr[0])) !== null && _e !== void 0 ? _e : 1;
                    scaleY = (_f = Number(transformArr[0])) !== null && _f !== void 0 ? _f : 1;
                }
            }
        }
        return {
            el: el,
            tagName: el.tagName,
            x: x,
            y: y,
            w: w,
            h: h,
            centerX: centerX,
            centerY: centerY,
            index: 0,
            distance: Math.sqrt(Math.pow(centerX - window.innerWidth / 2, 2) + Math.pow(centerY - window.innerHeight / 2, 2)),
            cornerDistance: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
            children: [],
            startTime: 0,
            endTime: 0,
            duration: 0,
            originalStyle: {
                opacity: (_g = Number(window.getComputedStyle(el).opacity)) !== null && _g !== void 0 ? _g : 1,
                scaleX: scaleX,
                scaleY: scaleY,
                transformOrigin: window.getComputedStyle(el).transformOrigin,
                width: window.getComputedStyle(el).width,
                height: window.getComputedStyle(el).height
            },
            type: this._getType(el),
            grow: el.grow
        };
    };
    /**
     * 根据HTMLElement，获取动画类型
     * @param obj 动画对象
     * @returns 动画类型
     */
    HTMLPageParser.prototype._getType = function (el) {
        var _a;
        var etype = EGrowElementType.none;
        switch (el.tagName.toUpperCase()) {
            case "IMG":
                etype = EGrowElementType.image;
                break;
            case "SVG":
                etype = EGrowElementType.svg;
                break;
            case "VIDEO":
                etype = EGrowElementType.video;
                break;
            case "CANVAS":
                etype = EGrowElementType.canvas;
                break;
            case "STYLE":
                etype = EGrowElementType.style;
                break;
        }
        var hasBg = (window.getComputedStyle(el).backgroundColor != 'rgba(0, 0, 0, 0)'
            || window.getComputedStyle(el).backgroundImage != 'none'
            || window.getComputedStyle(el).borderImageSource != 'none');
        // 元素有背景图片/背景颜色
        if (hasBg) {
            etype = EGrowElementType.bg;
        }
        // echarts
        if (el.hasAttribute('_echarts_instance_')) {
            etype = EGrowElementType.chart;
        }
        //文本/数字
        if (el.nodeType === 1 && el.children.length === 0 && el.innerText && (etype !== EGrowElementType.style)) {
            var text = el.innerText, isNum = isNaN(Number(text.replace(",", "")));
            if (isNum) {
                if (hasBg) {
                    //字符串+背景
                    etype = EGrowElementType.bgString;
                }
                else {
                    //字符串
                    etype = EGrowElementType.string;
                }
            }
            else {
                if (hasBg) {
                    //数字+背景
                    etype = EGrowElementType.bgNumber;
                }
                else {
                    //数字
                    etype = EGrowElementType.number;
                }
            }
        }
        //判断是否为叶子节点
        var isLeafNode = false;
        //如果anovSimpleMode=true，则判断el类名是否包含anov-part，若包含则设置该元素为叶子节点
        if (this._option.anovSimpleMode) {
            var anovPartClassName = 'anov-part', classStr = el.className;
            if ((typeof classStr == 'string') && (classStr.constructor == String) && ((_a = el.className) === null || _a === void 0 ? void 0 : _a.indexOf(anovPartClassName)) > -1) {
                isLeafNode = true;
            }
        }
        else {
            //如果anovSimpleMode=false，则判断this._parseLayer和this._option.parseLayer是否相等，若相等该元素为叶子节点
            if (this._option.parseLayer && (this._parseLayer === this._option.parseLayer)) {
                isLeafNode = true;
            }
        }
        if (isLeafNode) {
            etype = EGrowElementType.leafNode;
        }
        if (this._option.anovSimpleMode && this._option.leafNodeType == 'sys_height' && isLeafNode) {
            el.className.add('leafNode');
            el.style.height = 0;
            // el.style.overflow = 'hidden'
        }
        else if (this._option.anovSimpleMode && this._option.leafNodeType == 'sys_width' && isLeafNode) {
            el.style.width = 0;
            el.style.overflow = 'hidden';
        }
        else if (etype != EGrowElementType.none && (etype !== EGrowElementType.style) && (etype !== EGrowElementType.string)) {
            el.style.opacity = 0;
        }
        return etype;
    };
    /**
     * 判断是否遍历元素子元素
     * @param el
     * @returns
     */
    HTMLPageParser.prototype._isParse = function (el) {
        // 当元素类型为svg/chart/leafNode，不遍历子元素
        if ((el.type !== EGrowElementType.svg) && (el.type !== EGrowElementType.chart) && (el.type !== EGrowElementType.leafNode)) {
            return true;
        }
        return false;
    };
    return HTMLPageParser;
}(AbstractParser));

/**
 * 进场动画方式
 */
var EGrowType;
(function (EGrowType) {
    EGrowType[EGrowType["LeftToRight"] = 1] = "LeftToRight";
    EGrowType[EGrowType["RightToLeft"] = 2] = "RightToLeft";
    EGrowType[EGrowType["TopToBottom"] = 3] = "TopToBottom";
    EGrowType[EGrowType["BottomToTop"] = 4] = "BottomToTop";
    EGrowType[EGrowType["LeftTopToRightBottom"] = 5] = "LeftTopToRightBottom";
    EGrowType[EGrowType["CenterToAround"] = 6] = "CenterToAround";
    // 待扩展..
})(EGrowType || (EGrowType = {}));
/**
 * 解析规则工厂，通过参数配置生成解析规则
 */
var RuleFactory = /** @class */ (function () {
    function RuleFactory() {
    }
    RuleFactory.create = function (opt) {
        var rule;
        switch (opt.growType) {
            case EGrowType.LeftTopToRightBottom:
                rule = new LeftTopToRightBottomParserRule();
                break;
            case EGrowType.TopToBottom:
                rule = new TopToBottomParserRule();
                break;
            case EGrowType.LeftToRight:
                rule = new LeftToRightParserRule();
                break;
            case EGrowType.CenterToAround:
                rule = new CenterToAroundParserRule();
                break;
            default:
                rule = new LeftTopToRightBottomParserRule();
                break;
        }
        return rule;
    };
    return RuleFactory;
}());
/**
 * 左上到右下解析规则
 */
var LeftTopToRightBottomParserRule = /** @class */ (function () {
    function LeftTopToRightBottomParserRule() {
    }
    LeftTopToRightBottomParserRule.prototype.exec = function (elements) {
        // lerftTopToRightBottom 进场排序    
        elements = getOrderLeftTopToRightBottom(elements);
    };
    return LeftTopToRightBottomParserRule;
}());
/**
 * 上到下解析规则
 */
var TopToBottomParserRule = /** @class */ (function () {
    function TopToBottomParserRule() {
    }
    TopToBottomParserRule.prototype.exec = function (elements) {
        //TopToBottom 进场排序
        elements = getOrderTopToBottom(elements);
    };
    return TopToBottomParserRule;
}());
/**
 * 左到右解析规则
 */
var LeftToRightParserRule = /** @class */ (function () {
    function LeftToRightParserRule() {
    }
    LeftToRightParserRule.prototype.exec = function (elements) {
        //LeftToRight 进场排序
        elements = getOrderLeftToRight(elements);
    };
    return LeftToRightParserRule;
}());
/**
 * 中间到周围解析规则
 */
var CenterToAroundParserRule = /** @class */ (function () {
    function CenterToAroundParserRule() {
    }
    CenterToAroundParserRule.prototype.exec = function (elements) {
        //CenterToAround 进场排序
        elements.sort(function (a, b) { return a.distance - b.distance; });
    };
    return CenterToAroundParserRule;
}());
/**
 * 从上到下——递归获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns
 */
function getOrderTopToBottom(elements) {
    var orderArr = orderTopToBottom(elements);
    for (var i = 0; i < orderArr.length; i++) {
        for (var j = 0; j < orderArr[i].length; j++) {
            orderArr[i][j].children = getOrderTopToBottom(orderArr[i][j].children);
        }
    }
    return orderArr;
}
/**
 * 从上到下——根据元素y值排序
 * @param elements
 * @returns 排序后得到二维数组
 */
function orderTopToBottom(elements) {
    var t, n = elements.length;
    // 按元素y值进行排序，得到一个一维数组
    for (var i = 1; i < n; i++) {
        for (var j = 0; j < n - i; j++) {
            if (elements[j].y == elements[j + 1].y && elements[j].x > elements[j + 1].x) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
            else if (elements[j].y > elements[j + 1].y) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
        }
    }
    // 元素值相等，放入同一数组，最终得到二维数组
    var newArr = [];
    for (var i = 0; i < elements.length; i++) {
        if (newArr.length) {
            var hasFlag = false;
            for (var m = 0; m < newArr.length; m++) {
                if (newArr[m][0].y === elements[i].y) {
                    newArr[m].push(elements[i]);
                    hasFlag = true;
                }
            }
            if (!hasFlag) {
                newArr.push([elements[i]]);
            }
        }
        else {
            newArr.push([elements[i]]);
        }
    }
    return newArr;
}
/**
 * 从左到右——获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns
 */
function getOrderLeftToRight(elements) {
    var orderArr = orderLeftToRight(elements);
    for (var i = 0; i < orderArr.length; i++) {
        for (var j = 0; j < orderArr[i].length; j++) {
            orderArr[i][j].children = getOrderLeftToRight(orderArr[i][j].children);
        }
    }
    return orderArr;
}
/**
 * 从左到右——递归获取排序后的元素对象
 * @param elements
 * @returns
 */
function orderLeftToRight(elements) {
    var t, n = elements.length;
    for (var i = 1; i < n; i++) {
        for (var j = 0; j < n - i; j++) {
            if (elements[j].x == elements[j + 1].x && elements[j].y > elements[j + 1].y) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
            else if (elements[j].x > elements[j + 1].x) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
        }
    }
    var newArr = [];
    for (var i = 0; i < elements.length; i++) {
        if (newArr.length) {
            var hasFlag = false;
            for (var m = 0; m < newArr.length; m++) {
                if (newArr[m][0].x === elements[i].x) {
                    newArr[m].push(elements[i]);
                    hasFlag = true;
                }
            }
            if (!hasFlag) {
                newArr.push([elements[i]]);
            }
        }
        else {
            newArr.push([elements[i]]);
        }
    }
    return newArr;
}
function getOrderLeftTopToRightBottom(elements) {
    var orderArr = orderLeftTopToRightBottom(elements);
    for (var i = 0; i < orderArr.length; i++) {
        for (var j = 0; j < orderArr[i].length; j++) {
            orderArr[i][j].children = getOrderLeftTopToRightBottom(orderArr[i][j].children);
        }
    }
    return orderArr;
}
function orderLeftTopToRightBottom(elements) {
    var t, n = elements.length;
    for (var i = 1; i < n; i++) {
        for (var j = 0; j < n - i; j++) {
            if (elements[j].cornerDistance == elements[j + 1].cornerDistance && elements[j].y > elements[j + 1].y) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
            else if (elements[j].cornerDistance > elements[j + 1].cornerDistance) {
                t = elements[j];
                elements[j] = elements[j + 1];
                elements[j + 1] = t;
            }
        }
    }
    var newArr = [];
    for (var i = 0; i < elements.length; i++) {
        if (newArr.length) {
            var hasFlag = false;
            for (var m = 0; m < newArr.length; m++) {
                if (newArr[m][0].cornerDistance === elements[i].cornerDistance) {
                    newArr[m].push(elements[i]);
                    hasFlag = true;
                }
            }
            if (!hasFlag) {
                newArr.push([elements[i]]);
            }
        }
        else {
            newArr.push([elements[i]]);
        }
    }
    return newArr;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var SplitText_minExports = {};
var SplitText_min = {
  get exports(){ return SplitText_minExports; },
  set exports(v){ SplitText_minExports = v; },
};

/*!
 * VERSION: beta 0.2.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */

(function (module) {
	var _gsScope=module.exports&&"undefined"!=typeof commonjsGlobal?commonjsGlobal:commonjsGlobal||window;((function(t){var e=t.GreenSockGlobals||t,i=function(t){var i,s=t.split("."),r=e;for(i=0;s.length>i;i++)r[s[i]]=r=r[s[i]]||{};return r},s=i("com.greensock.utils"),r=function(t){var e=t.nodeType,i="";if(1===e||9===e||11===e){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)i+=r(t);}else if(3===e||4===e)return t.nodeValue;return i},n=document,a=n.defaultView?n.defaultView.getComputedStyle:function(){},o=/([A-Z])/g,h=function(t,e,i,s){var r;return (i=i||a(t,null))?(t=i.getPropertyValue(e.replace(o,"-$1").toLowerCase()),r=t||i.length?t:i[e]):t.currentStyle&&(i=t.currentStyle,r=i[e]),s?r:parseInt(r,10)||0},l=function(t){return t.length&&t[0]&&(t[0].nodeType&&t[0].style&&!t.nodeType||t[0].length&&t[0][0])?!0:!1},_=function(t){var e,i,s,r=[],n=t.length;for(e=0;n>e;e++)if(i=t[e],l(i))for(s=i.length,s=0;i.length>s;s++)r.push(i[s]);else r.push(i);return r},u=")eefec303079ad17405c",c=/(?:<br>|<br\/>|<br \/>)/gi,p=n.all&&!n.addEventListener,f="<div style='position:relative;display:inline-block;"+(p?"*display:inline;*zoom:1;'":"'"),m=function(t){t=t||"";var e=-1!==t.indexOf("++"),i=1;return e&&(t=t.split("++").join("")),function(){return f+(t?" class='"+t+(e?i++:"")+"'>":">")}},d=s.SplitText=e.SplitText=function(t,e){if("string"==typeof t&&(t=d.selector(t)),!t)throw "cannot split a null element.";this.elements=l(t)?_(t):[t],this.chars=[],this.words=[],this.lines=[],this._originals=[],this.vars=e||{},this.split(e);},g=function(t,e,i,s,o){c.test(t.innerHTML)&&(t.innerHTML=t.innerHTML.replace(c,u));var l,_,p,f,d,g,v,y,T,w,b,x,P,S=r(t),C=e.type||e.split||"chars,words,lines",k=-1!==C.indexOf("lines")?[]:null,R=-1!==C.indexOf("words"),A=-1!==C.indexOf("chars"),D="absolute"===e.position||e.absolute===!0,O=D?"&#173; ":" ",M=-999,L=a(t),z=h(t,"paddingLeft",L),I=h(t,"borderBottomWidth",L)+h(t,"borderTopWidth",L),E=h(t,"borderLeftWidth",L)+h(t,"borderRightWidth",L),N=h(t,"paddingTop",L)+h(t,"paddingBottom",L),F=h(t,"paddingLeft",L)+h(t,"paddingRight",L),X=h(t,"textAlign",L,!0),U=t.clientHeight,B=t.clientWidth,j=S.length,Y="</div>",q=m(e.wordsClass),G=m(e.charsClass),V=-1!==(e.linesClass||"").indexOf("++"),Q=e.linesClass;for(V&&(Q=Q.split("++").join("")),p=q(),f=0;j>f;f++)g=S.charAt(f),")"===g&&S.substr(f,20)===u?(p+=Y+"<BR/>",f!==j-1&&(p+=" "+q()),f+=19):" "===g&&" "!==S.charAt(f-1)&&f!==j-1?(p+=Y,f!==j-1&&(p+=O+q())):p+=A&&" "!==g?G()+g+"</div>":g;for(t.innerHTML=p+Y,d=t.getElementsByTagName("*"),j=d.length,v=[],f=0;j>f;f++)v[f]=d[f];if(k||D)for(f=0;j>f;f++)y=v[f],_=y.parentNode===t,(_||D||A&&!R)&&(T=y.offsetTop,k&&_&&T!==M&&"BR"!==y.nodeName&&(l=[],k.push(l),M=T),D&&(y._x=y.offsetLeft,y._y=T,y._w=y.offsetWidth,y._h=y.offsetHeight),k&&(R!==_&&A||(l.push(y),y._x-=z),_&&f&&(v[f-1]._wordEnd=!0)));for(f=0;j>f;f++)y=v[f],_=y.parentNode===t,"BR"!==y.nodeName?(D&&(b=y.style,R||_||(y._x+=y.parentNode._x,y._y+=y.parentNode._y),b.left=y._x+"px",b.top=y._y+"px",b.position="absolute",b.display="block",b.width=y._w+1+"px",b.height=y._h+"px"),R?_?s.push(y):A&&i.push(y):_?(t.removeChild(y),v.splice(f--,1),j--):!_&&A&&(T=!k&&!D&&y.nextSibling,t.appendChild(y),T||t.appendChild(n.createTextNode(" ")),i.push(y))):k||D?(t.removeChild(y),v.splice(f--,1),j--):R||t.appendChild(y);if(k){for(D&&(w=n.createElement("div"),t.appendChild(w),x=w.offsetWidth+"px",T=w.offsetParent===t?0:t.offsetLeft,t.removeChild(w)),b=t.style.cssText,t.style.cssText="display:none;";t.firstChild;)t.removeChild(t.firstChild);for(P=!D||!R&&!A,f=0;k.length>f;f++){for(l=k[f],w=n.createElement("div"),w.style.cssText="display:block;text-align:"+X+";position:"+(D?"absolute;":"relative;"),Q&&(w.className=Q+(V?f+1:"")),o.push(w),j=l.length,d=0;j>d;d++)"BR"!==l[d].nodeName&&(y=l[d],w.appendChild(y),P&&(y._wordEnd||R)&&w.appendChild(n.createTextNode(" ")),D&&(0===d&&(w.style.top=y._y+"px",w.style.left=z+T+"px"),y.style.top="0px",T&&(y.style.left=y._x-T+"px")));R||A||(w.innerHTML=r(w).split(String.fromCharCode(160)).join(" ")),D&&(w.style.width=x,w.style.height=y._h+"px"),t.appendChild(w);}t.style.cssText=b;}D&&(U>t.clientHeight&&(t.style.height=U-N+"px",U>t.clientHeight&&(t.style.height=U+I+"px")),B>t.clientWidth&&(t.style.width=B-F+"px",B>t.clientWidth&&(t.style.width=B+E+"px")));},v=d.prototype;v.split=function(t){this.isSplit&&this.revert(),this.vars=t||this.vars,this._originals.length=this.chars.length=this.words.length=this.lines.length=0;for(var e=0;this.elements.length>e;e++)this._originals[e]=this.elements[e].innerHTML,g(this.elements[e],this.vars,this.chars,this.words,this.lines);return this.isSplit=!0,this},v.revert=function(){if(!this._originals)throw "revert() call wasn't scoped properly.";for(var t=this._originals.length;--t>-1;)this.elements[t].innerHTML=this._originals[t];return this.chars=[],this.words=[],this.lines=[],this.isSplit=!1,this},d.selector=t.$||t.jQuery||function(e){return t.$?(d.selector=t.$,t.$(e)):n?n.getElementById("#"===e.charAt(0)?e.substr(1):e):e},d.version="0.2.4";}))(_gsScope),function(t){var e=function(){return (_gsScope.GreenSockGlobals||_gsScope)[t]};module.exports&&(module.exports=e());}("SplitText");
} (SplitText_min));

var SplitText = SplitText_minExports;

var ScrambleTextPlugin3_minExports = {};
var ScrambleTextPlugin3_min = {
  get exports(){ return ScrambleTextPlugin3_minExports; },
  set exports(v){ ScrambleTextPlugin3_minExports = v; },
};

/*!
 * ScrambleTextPlugin 3.8.0
 * https://greensock.com
 *
 * @license Copyright 2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

(function (module, exports) {
	!(function (D, u) {
	  u(exports)
	    ;
	})(commonjsGlobal, function (D) {
	  var r = /(^\s+|\s+$)/g,
	    o =
	      /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;
	  function getText(D) {
	    var u = D.nodeType,
	      F = "";
	    if (1 === u || 9 === u || 11 === u) {
	      if ("string" == typeof D.textContent) return D.textContent;
	      for (D = D.firstChild; D; D = D.nextSibling) F += getText(D);
	    } else if (3 === u || 4 === u) return D.nodeValue;
	    return F;
	  }
	  function emojiSafeSplit(D, u, F) {
	    if (((D += ""), F && (D = D.replace(r, "")), u && "" !== u))
	      return D.replace(/>/g, "&gt;").replace(/</g, "&lt;").split(u);
	    for (var C, e, E = [], t = D.length, n = 0; n < t; n++)
	      ((55296 <= (e = D.charAt(n)).charCodeAt(0) && e.charCodeAt(0) <= 56319) ||
	        (65024 <= D.charCodeAt(n + 1) && D.charCodeAt(n + 1) <= 65039)) &&
	        ((C = ((D.substr(n, 12).split(o) || [])[1] || "").length || 2),
	        (e = D.substr(n, C)),
	        (n += C - (E.emoji = 1))),
	        E.push(">" === e ? "&gt;" : "<" === e ? "&lt;" : e);
	    return E;
	  }
	  var s =
	    ((CharSet.prototype.grow = function grow(D) {
	      for (var u = 0; u < 20; u++)
	        this.sets[u] += F(D - this.length, this.chars);
	      this.length = D;
	    }),
	    CharSet);
	  function CharSet(D) {
	    (this.chars = emojiSafeSplit(D)), (this.sets = []), (this.length = 50);
	    for (var u = 0; u < 20; u++) this.sets[u] = F(80, this.chars);
	  }
	  function i() {
	    return (
	      e ||
	      ("undefined" != typeof window &&
	        (e = window.gsap) &&
	        e.registerPlugin &&
	        e)
	    );
	  }
	  function l() {
	    return String.fromCharCode.apply(null, arguments);
	  }
	  function t() {
	    a = e = i();
	  }
	  var e,
	    a,
	    n = l(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
	    B = (function (D) {
	      0 ===
	            (window ? window.location.href : "").indexOf(
	              l(102, 105, 108, 101, 58, 47, 47)
	            ) ||
	          -1 !== D.indexOf(l(108, 111, 99, 97, 108, 104, 111, 115, 116)) ||
	          -1 !== D.indexOf(l(49, 50, 55, 46, 48, 32, 48, 46, 49));
	        [
	          n,
	          l(99, 111, 100, 101, 112, 101, 110, 46, 105, 111),
	          l(
	            99,
	            111,
	            100,
	            101,
	            112,
	            101,
	            110,
	            46,
	            112,
	            108,
	            117,
	            109,
	            98,
	            105,
	            110,
	            103
	          ),
	          l(99, 111, 100, 101, 112, 101, 110, 46, 100, 101, 118),
	          l(99, 111, 100, 101, 112, 101, 110, 46, 97, 112, 112),
	          l(112, 101, 110, 115, 46, 99, 108, 111, 117, 100),
	          l(99, 115, 115, 45, 116, 114, 105, 99, 107, 115, 46, 99, 111, 109),
	          l(99, 100, 112, 110, 46, 105, 111),
	          l(112, 101, 110, 115, 46, 105, 111),
	          l(103, 97, 110, 110, 111, 110, 46, 116, 118),
	          l(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116),
	          l(
	            116,
	            104,
	            101,
	            109,
	            101,
	            102,
	            111,
	            114,
	            101,
	            115,
	            116,
	            46,
	            110,
	            101,
	            116
	          ),
	          l(99, 101, 114, 101, 98, 114, 97, 120, 46, 99, 111, 46, 117, 107),
	          l(116, 121, 109, 112, 97, 110, 117, 115, 46, 110, 101, 116),
	          l(116, 119, 101, 101, 110, 109, 97, 120, 46, 99, 111, 109),
	          l(116, 119, 101, 101, 110, 108, 105, 116, 101, 46, 99, 111, 109),
	          l(112, 108, 110, 107, 114, 46, 99, 111),
	          l(104, 111, 116, 106, 97, 114, 46, 99, 111, 109),
	          l(119, 101, 98, 112, 97, 99, 107, 98, 105, 110, 46, 99, 111, 109),
	          l(97, 114, 99, 104, 105, 118, 101, 46, 111, 114, 103),
	          l(99, 111, 100, 101, 115, 97, 110, 100, 98, 111, 120, 46, 105, 111),
	          l(99, 115, 98, 46, 97, 112, 112),
	          l(115, 116, 97, 99, 107, 98, 108, 105, 116, 122, 46, 99, 111, 109),
	          l(99, 111, 100, 105, 101, 114, 46, 105, 111),
	          l(
	            109,
	            111,
	            116,
	            105,
	            111,
	            110,
	            116,
	            114,
	            105,
	            99,
	            107,
	            115,
	            46,
	            99,
	            111,
	            109
	          ),
	          l(
	            115,
	            116,
	            97,
	            99,
	            107,
	            111,
	            118,
	            101,
	            114,
	            102,
	            108,
	            111,
	            119,
	            46,
	            99,
	            111,
	            109
	          ),
	          l(
	            115,
	            116,
	            97,
	            99,
	            107,
	            101,
	            120,
	            99,
	            104,
	            97,
	            110,
	            103,
	            101,
	            46,
	            99,
	            111,
	            109
	          ),
	          l(106, 115, 102, 105, 100, 100, 108, 101, 46, 110, 101, 116),
	        ];
	     
	    })(window ? window.location.host : ""),
	    A = /\s+/g,
	    F = function _scrambleText(D, u) {
	      for (var F = u.length, C = ""; -1 < --D; ) C += u[~~(Math.random() * F)];
	      return C;
	    },
	    u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	    C = u.toLowerCase(),
	    h = {
	      upperCase: new s(u),
	      lowerCase: new s(C),
	      upperAndLowerCase: new s(u + C),
	    },
	    f = {
	      version: "3.8.0",
	      name: "scrambleText",
	      register: function register(D) {
	        (e = D), t();
	      },
	      init: function init(D, u, F) {
	        if (
	          (a || t(),
	          (this.prop =
	            "innerHTML" in D
	              ? "innerHTML"
	              : "textContent" in D
	              ? "textContent"
	              : 0),
	          this.prop)
	        ) {
	          (this.target = D), "object" != typeof u && (u = { text: u });
	          var C,
	            e,
	            E,
	            n,
	            i = u.text || u.value || "",
	            l = !1 !== u.trim,
	            r = this;
	          return (
	            (r.delimiter = C = u.delimiter || ""),
	            (r.original = emojiSafeSplit(
	              getText(D).replace(A, " ").split("&nbsp;").join(""),
	              C,
	              l
	            )),
	            ("{original}" !== i && !0 !== i && null != i) ||
	              (i = r.original.join(C)),
	            (r.text = emojiSafeSplit((i || "").replace(A, " "), C, l)),
	            (r.hasClass = !(!u.newClass && !u.oldClass)),
	            (r.newClass = u.newClass),
	            (r.oldClass = u.oldClass),
	            (n = "" === C),
	            (r.textHasEmoji = n && !!r.text.emoji),
	            (r.charsHaveEmoji = !!u.chars && !!emojiSafeSplit(u.chars).emoji),
	            (r.length = n ? r.original.length : r.original.join(C).length),
	            (r.lengthDif =
	              (n ? r.text.length : r.text.join(C).length) - r.length),
	            (r.fillChar =
	              u.fillChar || (u.chars && ~u.chars.indexOf(" ")) ? "&nbsp;" : ""),
	            (r.charSet = E = h[u.chars || "upperCase"] || new s(u.chars)),
	            (r.speed = 0.05 / (u.speed || 1)),
	            (r.prevScrambleTime = 0),
	            (r.setIndex = (20 * Math.random()) | 0),
	            (e = r.length + Math.max(r.lengthDif, 0)) > E.length && E.grow(e),
	            (r.chars = E.sets[r.setIndex]),
	            (r.revealDelay = u.revealDelay || 0),
	            (r.tweenLength = !1 !== u.tweenLength),
	            (r.tween = F),
	            (r.rightToLeft = !!u.rightToLeft),
	            r._props.push("scrambleText", "text"),
	            B
	          );
	        }
	      },
	      render: function render(D, u) {
	        var F,
	          C,
	          e,
	          E,
	          t,
	          n,
	          i,
	          l,
	          r,
	          o,
	          s,
	          a = u.target,
	          B = u.prop,
	          A = u.text,
	          h = u.delimiter,
	          f = u.tween,
	          p = u.prevScrambleTime,
	          c = u.revealDelay,
	          g = u.setIndex,
	          d = u.chars,
	          m = u.charSet,
	          w = u.length,
	          x = u.textHasEmoji,
	          S = u.charsHaveEmoji,
	          j = u.lengthDif,
	          v = u.tweenLength,
	          T = u.oldClass,
	          b = u.newClass,
	          _ = u.rightToLeft,
	          y = u.fillChar,
	          L = u.speed,
	          M = u.original,
	          O = u.hasClass,
	          H = A.length,
	          P = f._time,
	          I = P - p;
	        c &&
	          (f._from && (P = f._dur - P),
	          (D =
	            0 === P
	              ? 0
	              : P < c
	              ? 1e-6
	              : P === f._dur
	              ? 1
	              : f._ease((P - c) / (f._dur - c)))),
	          D < 0 ? (D = 0) : 1 < D && (D = 1),
	          _ && (D = 1 - D),
	          (F = ~~(D * H + 0.5)),
	          (E = D
	            ? ((L < I || I < -L) &&
	                ((u.setIndex = g = (g + ((19 * Math.random()) | 0)) % 20),
	                (u.chars = m.sets[g]),
	                (u.prevScrambleTime += I)),
	              d)
	            : M.join(h)),
	          (s = f._from ? D : 1 - D),
	          (o = w + (v ? (f._from ? s * s * s : 1 - s * s * s) : 1) * j),
	          (E = _
	            ? 1 !== D || (!f._from && "isFromStart" !== f.data)
	              ? ((i = A.slice(F).join(h)),
	                (e = S
	                  ? emojiSafeSplit(E)
	                      .slice(
	                        0,
	                        (o - (x ? emojiSafeSplit(i) : i).length + 0.5) | 0
	                      )
	                      .join("")
	                  : E.substr(
	                      0,
	                      (o - (x ? emojiSafeSplit(i) : i).length + 0.5) | 0
	                    )),
	                i)
	              : ((e = ""), M.join(h))
	            : ((e = A.slice(0, F).join(h)),
	              (C = (x ? emojiSafeSplit(e) : e).length),
	              S
	                ? emojiSafeSplit(E)
	                    .slice(C, (o + 0.5) | 0)
	                    .join("")
	                : E.substr(C, (o - C + 0.5) | 0))),
	          (i = O
	            ? ((t = (l = _ ? T : b) && 0 != F)
	                ? "<span class='" + l + "'>"
	                : "") +
	              e +
	              (t ? "</span>" : "") +
	              ((n = (r = _ ? b : T) && F !== H)
	                ? "<span class='" + r + "'>"
	                : "") +
	              h +
	              E +
	              (n ? "</span>" : "")
	            : e + h + E),
	          (a[B] =
	            "&nbsp;" === y && ~i.indexOf("  ")
	              ? i.split("  ").join("&nbsp;&nbsp;")
	              : i);
	      },
	    };
	  (f.emojiSafeSplit = emojiSafeSplit),
	    (f.getText = getText),
	    i() && e.registerPlugin(f),
	    (D.ScrambleTextPlugin = f),
	    (D.default = f);
	  if (typeof window === "undefined" || window !== D) {
	    Object.defineProperty(D, "__esModule", { value: !0 });
	  } else {
	    delete D.default;
	  }
	});
} (ScrambleTextPlugin3_min, ScrambleTextPlugin3_minExports));

var ScrambleTextPlugin = /*@__PURE__*/getDefaultExportFromCjs(ScrambleTextPlugin3_minExports);

function fomatterNum(num) {
    if (typeof num === 'number') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return ''
    }
  }

/**
 * 封装gsap
 */
var GrowTween = /** @class */ (function (_super) {
    __extends(GrowTween, _super);
    function GrowTween() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GrowTween;
}(gsap.core.Tween));
var GrowTimeLine = /** @class */ (function (_super) {
    __extends(GrowTimeLine, _super);
    function GrowTimeLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GrowTimeLine;
}(gsap.core.Timeline));
/**
 * 进出场动画控制器
 */
var HTMLGrowAnimateController = /** @class */ (function () {
    function HTMLGrowAnimateController(elements, opt) {
        this._option = opt;
        this._els = elements;
        //注册通用动画    
        this._registerEffects();
        //构建动画线      
        this._tl = new GrowTimeLine();
        // this._tl= gsap.timeline()
    }
    HTMLGrowAnimateController.prototype._init = function () {
        this._tl.add(this._getTl(this._els));
        return this._tl;
    };
    /**
     * 获取动画线
     * @param els
     * @returns GrowTimeLine
     */
    HTMLGrowAnimateController.prototype._getTl = function (els) {
        var parentTl = new GrowTimeLine();
        parentTl.addLabel('start');
        for (var i = 0; i < els.length; i++) {
            var childTl = new GrowTimeLine();
            childTl.addLabel('start');
            //判断该元素是否有自定义动画线
            var customTl = this._elementHasCustomTl(els[i]);
            if (customTl.duration()) {
                parentTl.add(customTl, 'start+=0');
            }
            else {
                parentTl.add(this._setElementAnimate(els[i]), 'start+=0');
                if (els[i].children.length) {
                    childTl = this._getTlRecurve(els[i].children);
                }
            }
            parentTl.add(childTl, 'start+=0');
        }
        return parentTl;
    };
    /**
     * 递归获取子动画线
     * @param els
     * @returns GrowTimeLine
     */
    HTMLGrowAnimateController.prototype._getTlRecurve = function (els) {
        var parentTl = new GrowTimeLine();
        parentTl.addLabel('start');
        for (var i = 0; i < els.length; i++) {
            var minDuration = 0;
            var childTl = new GrowTimeLine();
            childTl.addLabel('start');
            for (var j = 0; j < els[i].length; j++) {
                var tl = new GrowTimeLine();
                //判断该元素是否有自定义动画线
                var customTl = this._elementHasCustomTl(els[i][j]);
                if (customTl.duration()) {
                    tl.add(customTl, 'start+=0');
                }
                else {
                    tl.add(this._setElementAnimate(els[i][j]), 'start+=0');
                    if (els[i][j].children.length) {
                        tl.add(this._getTlRecurve(els[i][j].children), 'start+=0');
                    }
                }
                childTl.add(tl, 'start+=0');
                minDuration = minDuration ? Math.min(minDuration, tl.duration()) : tl.duration();
            }
            //获取某一行各模块最小动画时间，与interval比较，得到下一行开始时间
            // minDuration = Math.min(minDuration, this._option.interval)
            // totalMin += minDuration
            parentTl.add(childTl, 'start+=' + i * this._option.interval);
        }
        return parentTl;
    };
    Object.defineProperty(HTMLGrowAnimateController.prototype, "timeLine", {
        get: function () {
            return this._tl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLGrowAnimateController.prototype, "effects", {
        get: function () {
            var effects = Object.keys(gsap.effects);
            return effects;
        },
        enumerable: false,
        configurable: true
    });
    HTMLGrowAnimateController.prototype.enter = function () {
        this._tl.play();
    };
    HTMLGrowAnimateController.prototype.creatTl = function () {
        gsap.registerPlugin(ScrambleTextPlugin);
        if (!this._tl.duration()) {
            //为所有元素初始化动画任务
            var tl = this._init();
            return tl;
        }
        else
            return this._tl;
    };
    HTMLGrowAnimateController.prototype.leave = function () {
        this._tl.reverse();
    };
    HTMLGrowAnimateController.prototype.stop = function () {
        this._tl.pause();
    };
    //增加动画效果
    HTMLGrowAnimateController.prototype.addEffect = function (effectList) {
        //存在问题：未进行效果名称同名处理
        effectList.forEach(function (effect) {
            gsap.registerEffect({
                name: effect.id,
                defaults: { duration: 1 },
                extendTimeline: true,
                effect: function (targets, config) {
                    if (effect.animate === 'from') {
                        return gsap.from(targets, __assign(__assign({}, effect.props), config));
                    }
                    else if (effect.animate === 'fromTo') {
                        return gsap.fromTo(targets, __assign(__assign({}, effect.props), config), __assign({}, effect.props2));
                    }
                    else {
                        return gsap.to(targets, __assign(__assign({}, effect.props), config));
                    }
                }
            });
        });
    };
    //为元素设置动画
    HTMLGrowAnimateController.prototype._setElementAnimate = function (element) {
        var gt;
        switch (element.type) {
            case EGrowElementType.chart:
                // gt=new GrowTween(element.el,{duration: 1, background:'red',opacity: 1})
                gt = gsap.effects.sys_opacity(element.el, { duration: EGrowElementTime.chart });
                break;
            case EGrowElementType.bg:
                gt = gsap.effects[this._option.bgType](element.el, { duration: EGrowElementTime.bg });
                // gt = gsap.effects[this._option.bgType](element.el, {duration: EGrowElementTime.bg, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.image:
                gt = gsap.effects[this._option.imageType](element.el, { duration: EGrowElementTime.image, originalStyle: element.originalStyle });
                break;
            case EGrowElementType.svg:
                gt = gsap.effects[this._option.svgType](element.el, { duration: EGrowElementTime.svg });
                break;
            case EGrowElementType.canvas:
                gt = gsap.effects[this._option.canvasType](element.el, { duration: EGrowElementTime.svg });
                break;
            case EGrowElementType.video:
                gt = gsap.effects[this._option.videoType](element.el, { duration: EGrowElementTime.video });
                break;
            case EGrowElementType.string:
                gt = gsap.effects[this._option.stringType](element.el, { duration: EGrowElementTime.string });
                break;
            case EGrowElementType.number:
                gt = gsap.effects[this._option.numberType](element.el, { duration: EGrowElementTime.number, value: element.el.innerHTML });
                break;
            case EGrowElementType.bgNumber:
                gt = gsap.effects.sys_bgNumber(element.el, { duration: EGrowElementTime.bgNumber, value: element.el.innerHTML });
                break;
            case EGrowElementType.bgString:
                gt = gsap.effects.sys_opacity(element.el, { duration: EGrowElementTime.bgString, value: element.el.innerHTML });
                break;
            case EGrowElementType.leafNode:
                // gt=gsap.effects[this._option.leafNodeType](element.el, {duration: EGrowElementTime.string})
                gt = gsap.effects[this._option.leafNodeType](element.el, { duration: EGrowElementTime.bg, originalStyle: element.originalStyle });
                break;
            case EGrowElementType.none:
                gt = new GrowTween(element.el, { duration: 0 });
                break;
            default: //none
                gt = new GrowTween(element.el, { duration: 0 });
                break;
        }
        if (element.grow) {
            // 判断当前元素是否有grow，若有则使用元素自带的grow
            gt = element.grow;
        }
        else {
            element.grow = gt;
        }
        return gt;
    };
    //注册动画类型
    HTMLGrowAnimateController.prototype._registerEffects = function () {
        var _this = this;
        //后期配置文件读入，提高可配性
        //透明度0 -> 1
        gsap.registerEffect({
            name: 'sys_opacity',
            effect: function (targets, config) {
                return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: config.duration });
            },
        });
        //缩放
        gsap.registerEffect({
            name: 'sys_scale',
            effect: function (targets, config) {
                // return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle.opacity, scaleX: config.originalStyle.scaleX, scaleY: config.originalStyle.scaleY, transformOrigin: this._getTransformOrigin(), duration: config.duration});
                // return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle?.opacity || 1, scaleX: config.originalStyle?.scaleX || 1, scaleY: config.originalStyle?.scaleY||1,  transformOrigin: this._getTransformOrigin(), duration: config.duration});
                return gsap.fromTo(targets, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, transformOrigin: _this._getTransformOrigin(), duration: config.duration });
            },
        });
        //高度变化
        gsap.registerEffect({
            name: 'sys_height',
            effect: function (targets, config) {
                return gsap.fromTo(targets, { opacity: 0, height: 0 }, { opacity: 1, height: config.originalStyle.height, duration: config.duration });
            },
        });
        //宽度变化
        gsap.registerEffect({
            name: 'sys_width',
            effect: function (targets, config) {
                return gsap.fromTo(targets, { opacity: 0, width: 0 }, { opacity: 1, width: config.originalStyle.width, duration: config.duration });
            },
        });
        //数字
        gsap.registerEffect({
            name: 'sys_number',
            effect: function (targets, config) {
                var decimals = 0;
                if (String(config.value).indexOf(".") > -1) {
                    decimals = String(config.value).split(".")[1].length;
                }
                var count = { val: 0 }, hasThousander = config.value.indexOf(",") > -1 ? true : false, actualValue = 0;
                //判断是否有千分符
                if (hasThousander) {
                    actualValue = Number(config.value.replace(",", ""));
                }
                else {
                    actualValue = config.value;
                }
                return gsap.to(targets, { opacity: 1, duration: 0.1, onComplete: function () {
                        gsap.to(count, { duration: config.duration, val: actualValue, onUpdate: function () {
                                if (hasThousander) {
                                    targets[0].innerHTML = fomatterNum(Number(count.val.toFixed(decimals)));
                                }
                                else {
                                    targets[0].innerHTML = count.val.toFixed(decimals);
                                }
                            } });
                    } });
            },
        });
        //stringWave
        gsap.registerEffect({
            name: 'sys_stringWave',
            effect: function (targets, config) {
                var duration = targets[0].innerHTML.length / 200 * config.duration;
                var mySplitText = new SplitText(targets, { type: "chars" });
                var chars = mySplitText.chars;
                gsap.set(targets, { opacity: 1, perspective: 400 });
                return gsap.from(chars, { duration: duration, opacity: 0, scale: 0, y: 80, rotationX: 100, transformOrigin: "0% 50% -50", ease: "back", stagger: 0.01 });
            },
        });
        //stringPrint
        gsap.registerEffect({
            name: 'sys_stringPrint',
            effect: function (targets, config) {
                var duration = targets[0].innerHTML.length / 50 * config.duration;
                var opt = {
                    text: targets[0].innerHTML,
                    chars: " ",
                    speed: 0.2,
                    ease: "none"
                };
                // gsap.set(targets, { opacity: 1})
                return gsap.to(targets, { duration: duration, scrambleText: __assign({}, opt) });
            },
        });
        //bgString动画方式：清空动画元素内容->背景动画->背景动画完成设置元素内容->内容动画 
        // 注意： 未测试onComplete里动画时间是否体现在整体动画时间上
        gsap.registerEffect({
            name: 'sys_bgString',
            effect: function (targets, config) {
                var text = targets[0].innerHTML;
                targets[0].innerHTML = "";
                return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: config.duration, onComplete: function () {
                        targets[0].innerHTML = text;
                        var mySplitText = new SplitText(targets, { type: "chars" });
                        var chars = mySplitText.chars;
                        gsap.set(targets, { perspective: 400 });
                        gsap.from(chars, { duration: config.duration, opacity: 0, scale: 0, y: 80, rotationX: 100, transformOrigin: '0 50% -50', ease: "back", stagger: 0.01 });
                    } });
            },
        });
        //bgNumber
        gsap.registerEffect({
            name: 'sys_bgNumber',
            effect: function (targets, config) {
                var decimals;
                if (String(config.value).indexOf(".") > -1) {
                    decimals = String(config.value).split(".")[1].length;
                }
                var hasThousander = config.value.indexOf(",") > -1 ? true : false, actualValue = 0;
                targets[0].innerHTML = "";
                //判断是否有千分符
                if (hasThousander) {
                    actualValue = Number(config.value.replace(",", ""));
                }
                else {
                    actualValue = config.value;
                }
                return gsap.fromTo(targets, { opacity: 0 }, { duration: config.duration, opacity: 1, onComplete: function () {
                        var count = { val: 0 };
                        gsap.to(count, { duration: config.duration, val: actualValue, onUpdate: function () {
                                if (hasThousander) {
                                    targets[0].innerHTML = fomatterNum(Number(count.val.toFixed(decimals)));
                                }
                                else {
                                    targets[0].innerHTML = count.val.toFixed(decimals);
                                }
                            } });
                    } });
            },
        });
    };
    // 根据传入的动画类型获取背景图片动画
    HTMLGrowAnimateController.prototype._getTransformOrigin = function () {
        var transformOrigin;
        switch (this._option.growType) {
            case EGrowType.LeftToRight:
                transformOrigin = 'left center';
                break;
            case EGrowType.TopToBottom:
                transformOrigin = 'top center';
                break;
            case EGrowType.LeftTopToRightBottom:
                transformOrigin = 'left top ';
                break;
            default:
                transformOrigin = 'top center';
                break;
        }
        return transformOrigin;
    };
    //判断元素是否有自定义动画线
    HTMLGrowAnimateController.prototype._elementHasCustomTl = function (element) {
        var tl = new GrowTimeLine({});
        this._option.customTl.forEach(function (item, index) {
            if ((item.target === element.el) && (item.tl instanceof GrowTimeLine)) {
                tl = item.tl;
            }
        });
        return tl;
    };
    return HTMLGrowAnimateController;
}());

var PageGrow = /** @class */ (function () {
    function PageGrow(opt) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        // 设置默认参数
        this.option = {
            target: (_a = opt === null || opt === void 0 ? void 0 : opt.target) !== null && _a !== void 0 ? _a : document.body,
            growType: (_b = opt === null || opt === void 0 ? void 0 : opt.growType) !== null && _b !== void 0 ? _b : 3,
            interval: (_c = opt === null || opt === void 0 ? void 0 : opt.interval) !== null && _c !== void 0 ? _c : 0.2,
            stringType: (_d = opt === null || opt === void 0 ? void 0 : opt.stringType) !== null && _d !== void 0 ? _d : 'sys_stringWave',
            numberType: (_e = opt === null || opt === void 0 ? void 0 : opt.numberType) !== null && _e !== void 0 ? _e : 'sys_number',
            bgType: (_f = opt === null || opt === void 0 ? void 0 : opt.bgType) !== null && _f !== void 0 ? _f : 'sys_scale',
            imageType: (_g = opt === null || opt === void 0 ? void 0 : opt.imageType) !== null && _g !== void 0 ? _g : 'sys_scale',
            svgType: (_h = opt === null || opt === void 0 ? void 0 : opt.svgType) !== null && _h !== void 0 ? _h : 'sys_scale',
            canvasType: (_j = opt === null || opt === void 0 ? void 0 : opt.canvasType) !== null && _j !== void 0 ? _j : 'sys_scale',
            videoType: (_k = opt === null || opt === void 0 ? void 0 : opt.videoType) !== null && _k !== void 0 ? _k : 'sys_scale',
            leafNodeType: (_l = opt === null || opt === void 0 ? void 0 : opt.leafNodeType) !== null && _l !== void 0 ? _l : 'sys_scale',
            customTl: [],
            anovSimpleMode: (_m = opt === null || opt === void 0 ? void 0 : opt.anovSimpleMode) !== null && _m !== void 0 ? _m : false,
            parseLayer: (_o = opt === null || opt === void 0 ? void 0 : opt.parseLayer) !== null && _o !== void 0 ? _o : 0,
        };
        //配置解析规则
        // const rule:IParserRule = RuleFactory.create({growType:<EGrowType>Number(opt.growType)})
        var rule = RuleFactory.create(this.option);
        //构建解析器
        var parser = new HTMLPageParser(rule);
        //开始解析
        var els = parser.parse(this.option);
        //对象列表按类型预定动画方案
        this._animateController = new HTMLGrowAnimateController(els, this.option);
    }
    PageGrow.prototype.enter = function () {
        var tl = this.creatTl();
        if (tl.duration() - 0 > 0) {
            //执行进场
            tl.play();
        }
        else {
            console.log("the timeline can not paly");
        }
    };
    PageGrow.prototype.leave = function () {
        this._animateController.leave();
    };
    PageGrow.prototype.stop = function () {
        this._animateController.stop();
    };
    PageGrow.prototype.creatTl = function () {
        var tl = this._animateController.creatTl();
        return tl;
    };
    PageGrow.prototype.addEffect = function (effectList) {
        this._animateController.addEffect(effectList);
    };
    return PageGrow;
}());

export { AbstractParser, CenterToAroundParserRule, EGrowType, HTMLPageParser, LeftToRightParserRule, LeftTopToRightBottomParserRule, PageGrow, RuleFactory, TopToBottomParserRule };
