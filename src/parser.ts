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
    private _option!: PageGrowOption
    private _parseLayer!: number

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
        this._option = opt
        this._parseLayer = 0
        //初始化所有元素基础信息
        this._els = this._parseHTMLElementNew(opt.target)
        //通过规则重新排序
        this._rule.exec(this._els)        
        return this._els
    }

    /**
     * 获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */

    private _parseHTMLElementNew(element: HTMLElement|any): Array<IGrowHTMLElement> {
        this._parseLayer++
        let element_x = element.getBoundingClientRect().left,
            element_y = element.getBoundingClientRect().top,
            element_centerX = element_x + element.offsetWidth / 2,
            element_centerY = element_y + element.offsetHeight / 2,
            element_info = [];
        let el = this._getElement(element, element_x, element_y, element_centerX, element_centerY)
        let isParse = this._isParse(el)
        if(isParse){
            el.children = this._parseHTMLElementRecurve(element)
        }
        element_info.push(el)
        return element_info
    }

    /**
     * 递归获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */
    private _parseHTMLElementRecurve(element: HTMLElement|any): Array<any> {
        this._parseLayer++
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
            let child = [], isParse = this._isParse(el)
            if(element_child[i].children.length && isParse){
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
            cornerDistance:  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
            children: [],
            startTime: 0,
            endTime: 0,
            duration: 0,
            originalStyle: {
                opacity: Number(window.getComputedStyle(el).opacity)??1,
                scaleX,
                scaleY,
                transformOrigin: window.getComputedStyle(el).transformOrigin,
                width: window.getComputedStyle(el).width,
                height: window.getComputedStyle(el).height
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
            case "CANVAS":
                etype = EGrowElementType.canvas
                break;
            case "STYLE":
                etype = EGrowElementType.style
                break;
        }
        let hasBg = (window.getComputedStyle(el).backgroundColor != 'rgba(0, 0, 0, 0)' 
            || window.getComputedStyle(el).backgroundImage != 'none' 
            || window.getComputedStyle(el).borderImageSource != 'none')
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


        //判断是否为叶子节点
        let isLeafNode = false
        //如果anovSimpleMode=true，则判断el类名是否包含anov-part，若包含则设置该元素为叶子节点
        if(this._option.anovSimpleMode){
            let anovPartClassName = 'anov-part', classStr = el.className
            if((typeof classStr == 'string') && (classStr.constructor == String) && el.className?.indexOf(anovPartClassName) > -1){
                isLeafNode = true
            }
        }else {
        //如果anovSimpleMode=false，则判断this._parseLayer和this._option.parseLayer是否相等，若相等该元素为叶子节点
            if(this._option.parseLayer && (this._parseLayer === this._option.parseLayer)){
                isLeafNode = true
            }
        }
        if(isLeafNode){
            etype = EGrowElementType.leafNode
        }

        if(this._option.anovSimpleMode && this._option.leafNodeType == 'sys_height' && isLeafNode){
            el.className.add('leafNode')
            el.style.height = 0
            // el.style.overflow = 'hidden'
        }else if(this._option.anovSimpleMode && this._option.leafNodeType == 'sys_width' && isLeafNode){
            el.style.width = 0
            el.style.overflow = 'hidden'
        }else if(etype != EGrowElementType.none && (etype !== EGrowElementType.style) &&  (etype !== EGrowElementType.string)){
            el.style.opacity = 0
        }

        return etype
    }

    /**
     * 判断是否遍历元素子元素
     * @param el 
     * @returns 
     */
    private _isParse(el:IGrowHTMLElement):boolean{
        // 当元素类型为svg/chart/leafNode，不遍历子元素
        if((el.type !== EGrowElementType.svg) && (el.type !== EGrowElementType.chart) && (el.type !== EGrowElementType.leafNode)){ 
           return true
        }
        return false
    }
}


