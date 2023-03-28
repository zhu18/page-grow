import type {IParserRule, EGrowType}  from './rule'
import {EGrowElementType, IDisposable, IGrowElement, IGrowHTMLElement, } from './common'
import { GrowTween } from './animate'
import {PageGrowOption} from './engine'

/**
 * 解析器抽象类
 */
export abstract class AbstractParser implements IDisposable{
    /**
     * 销毁解析器
     */
    public abstract dispose(): void;

    /**
     * 解析指定对象，编排所有子元素规则
     * @param target 被解析的父级对象
     */
    public abstract parse(target:any): Array<IGrowElement>;
}


/**
 * 解析HTML页面元素
 */
export class HTMLPageParser extends AbstractParser{
    constructor(rule:IParserRule){
        super()
        this._rule=rule
    }    

    private _rule:IParserRule
    private _els:IGrowHTMLElement[]=Array<IGrowHTMLElement>()
    private _duration:number = 3

    public get rule():IParserRule{
        return this._rule
    }
    public get elements():IGrowHTMLElement[]{
        return this._els
    }

    public dispose(): void {
        this._els.length=0
    }


    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param opt 配置参数
     * @returns IGrowHTMLElement数组
     */
    public parse(opt:PageGrowOption): Array<IGrowHTMLElement> {
        this._duration = opt.duration
        //初始化所有元素基础信息
        this._els = this._parseHTMLElementNew(opt.target)
        //通过规则重新排序
        this._rule.exec(this._els)        
        return this._els
    }


    /**
     * 递归解析元素的位置与大小
     * @param element 被解析的HTML元素
     * @param x x位置
     * @param y y位置
     */
    private _parseHTMLElement(element:HTMLElement|any, x = 0, y = 0): void {
        x += element.offsetLeft - (element.offsetParent?.clientLeft??0);
        y += element.offsetTop - (element.offsetParent?.clientTop??0);
        const h = element.offsetHeight
        const w = element.offsetWidth
        let centerX = x + element.offsetWidth / 2;
        let centerY = y + element.offsetHeight / 2;
        // if (element instanceof HTMLElement) {  对iframe内嵌页面 判断未知，初步估计v8引擎bug, iframe中的DOM元素，并且不能将其视为主文档HTMLElement类型的对象
        if(element.nodeType===1){
            // this._els.push({
            //         el: element,
            //         tagName:element.tagName,                   
            //         x,
            //         y,
            //         w,
            //         h,
            //         centerX,
            //         centerY,
            //         distance: Math.sqrt(Math.pow(centerX - window.innerWidth / 2, 2) + Math.pow(centerY - window.innerHeight / 2, 2)),
            //         type:this._getType(element),
            //         //解析后重置
            //         index: 0
            //     }
            // )
        }
        //}
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes[i];
            if(child.nodeType===1){
           // if (child instanceof HTMLElement) {
                this._parseHTMLElement(child, x + element.offsetLeft, y + element.offsetTop);
          //}
            }
        }
    }

    /**
     * 获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */

    private _parseHTMLElementNew(element: HTMLElement|any): Array<IGrowHTMLElement> {
        let element_x = element.getBoundingClientRect().left,
            element_y = element.getBoundingClientRect().top,
            element_centerX = element_x + element.offsetWidth / 2,
            element_centerY = element_y + element.offsetHeight / 2,
            element_info = [];
        let el = this._getElement(element, element_x, element_y, element_centerX, element_centerY)
            if((el.type !== EGrowElementType.svg) && (el.type !== EGrowElementType.chart)){ // 当元素类型为svg/chart时，不遍历子元素
                el.children = this._parseHTMLElementRecurve(element)
            }
            el.duration = this._duration
            element_info.push(el)
        return element_info
    }

    /**
     * 递归获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */
    private _parseHTMLElementRecurve(element: HTMLElement|any): Array<any> {
        
        let element_child = element.children,
            element_x = element.getBoundingClientRect().left,
            element_y = element.getBoundingClientRect().top,
            element_info = [];
        for(let i = 0 ; i < element_child.length; i++){
            // 针对dev平台模块辅助线dom忽略
            if(element_child[i].className.toString().includes("handle handle-")){
                break
            }
            // 针对页面script标签忽略
            if(element_child[i].nodeName == 'SCRIPT'){
                break
            }
            
            const x = element_child[i].getBoundingClientRect().left - element_x;
            const y = element_child[i].getBoundingClientRect().top - element_y;
            const w = element_child[i].offsetWidth??element_child[i].scrollWidth;
            const h = element_child[i].offsetHeight??element_child[i].scrollHeight;
            const centerX = x + w / 2;
            const centerY = y + h /2;
            let el = this._getElement(element_child[i], x, y, centerX, centerY)
            let child = []
            if(element_child[i].children.length && (el.type !== EGrowElementType.svg) && (el.type !== EGrowElementType.chart)){// 当元素类型为svg/chart时，不遍历子元素
                child = this._parseHTMLElementRecurve(element_child[i])
            }
            el.children = child
            element_info.push(el)
            
        }
        return element_info
    }

    /**
     * 获取元素对象
     * @param el 元素
     * @param x 元素位置x
     * @param y 元素位置y
     * @param centerX 元素中心点坐标x
     * @param centerY 元素中心点坐标y
     * @returns 
     */
    private _getElement(el: HTMLElement|any, x: number, y: number, centerX: number,  centerY: number): IGrowHTMLElement{

        // 当元素宽/高未设置为0时， 设置为相对定位，获取宽/高
        let w = Number(window.getComputedStyle(el).width.replace("px", "")) || el.offsetWidth, h = Number(window.getComputedStyle(el).height.replace("px", "")) || el.offsetHeight;
        if(!(w && h)){
            el.style.position = 'relative'
            w = el.scrollWidth
            h = el.scrollHeight
        }
     
        // 获取元素transform原始数值，因为动画是基于opacity、scale属性设置
        let transformStr = window.getComputedStyle(el).transform
        let transformArr:Array<string> = [], scaleX:number = 1, scaleY:number = 1
        if(transformStr != 'none'){
            if(transformStr.indexOf("matrix")>-1){
                transformArr = transformStr.substring(7).replace(")", "").split(",")
                scaleX = Number(transformArr[0])??1
                scaleY = Number(transformArr[3])??1
            }
            if(transformStr.indexOf("scale")>-1){
                transformArr = transformStr.substring(6).replace(")", "").split(",")
                if(transformArr.length>1){
                    scaleX = Number(transformArr[0])??1
                    scaleY = Number(transformArr[3])??1
                }else{
                    scaleX = Number(transformArr[0])??1
                    scaleY = Number(transformArr[0])??1
                }
                
            }
        }
        return {
            el: el,
            tagName: el.tagName,
            x,
            y,
            w,
            h,
            centerX,
            centerY,
            index: 0,
            distance:  Math.sqrt(Math.pow(centerX - window.innerWidth / 2, 2) + Math.pow(centerY - window.innerHeight / 2, 2)),
            children: [],
            startTime: 0,
            endTime: 0,
            duration: 0,
            originalStyle: {
                opacity: Number(window.getComputedStyle(el).opacity)??1,
                scaleX,
                scaleY,
                transformOrigin: window.getComputedStyle(el).transformOrigin
            },
            type: this._getType(el),
            grow: el.grow
        }
    }
    /**
     * 根据HTMLElement，获取动画类型
     * @param obj 动画对象
     * @returns 动画类型
     */
    private _getType(el:HTMLElement|any):EGrowElementType{
        let etype:EGrowElementType = EGrowElementType.none
        
        switch(el.tagName.toUpperCase()){
            case "IMG":
                etype = EGrowElementType.image
                break;
            case "SVG":
                etype = EGrowElementType.svg
                break;
            case "VIDEO":
                etype = EGrowElementType.video
                break;
            case "AUDIO":
                etype = EGrowElementType.audio
                break;
            case "CANVAS":
                etype = EGrowElementType.canvas
                break;
            case "STYLE":
                etype = EGrowElementType.style
                break;
        }
        let hasBg = window.getComputedStyle(el).backgroundColor != 'rgba(0, 0, 0, 0)' || window.getComputedStyle(el).backgroundImage != 'none'
        // 元素有背景图片/背景颜色
        if(hasBg){
            etype = EGrowElementType.bg
        }
        // echarts
        if(el.hasAttribute('_echarts_instance_')){
            etype = EGrowElementType.chart
        }
        //文本/数字
        if(el.nodeType === 1 && el.children.length === 0 && el.innerText && (etype !== EGrowElementType.style)){
            let text = el.innerText, isNum = isNaN(Number(text.replace(",", "")))
            if(isNum){
                if(hasBg){
                    //字符串+背景
                    etype = EGrowElementType.bgString
                }else {
                    //字符串
                    etype = EGrowElementType.string
                }
                
            }else {
                if(hasBg){
                    //数字+背景
                    etype = EGrowElementType.bgNumber
                }else {
                    //数字
                    etype = EGrowElementType.number
                }
                
            }
        }

        if(etype != EGrowElementType.none && (etype !== EGrowElementType.style)){
            el.style.opacity = 0
        }
        return etype
    }
}


