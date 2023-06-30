import type {IParserRule, EGrowType}  from './rule'
import {EGrowElementType, IDisposable, IGrowElement, IGrowHTMLElement, } from './common'
import { GrowTimeLine, isTl } from './animate'
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
        this._hasMatchEle = false
    }    

    private _rule:IParserRule
    private _els!:Array<IGrowHTMLElement>
    private _option!: PageGrowOption
    private _parseLayer!: number
    private _hasMatchEle: boolean

    public get rule():IParserRule{
        return this._rule
    }
    public get elements():Array<IGrowHTMLElement>{
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

        if(this._option.target && this._option.target instanceof Array && this._option.target.length){
            //若target 为 parts json
            let els = this._parsePartsConfig(opt.target), _els:Array<any> = []
            els.forEach(item => {
                if(isTl(item.tl)) {
                    _els.push(item)
                }
            })
            this._els = _els

        }else {
            //若未传入parts
            this._els = this._parseHTMLElement(opt.target)
        }
        
        //通过规则重新排序
        this._rule.exec(this._els)  
       
        return this._els
    }

    /**
     * 获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */

    private _parseHTMLElement(element: string | HTMLElement | Array<object> | null): Array<IGrowHTMLElement> {
        let element_info = [];
        if(element instanceof HTMLElement){
            let element_x = element.getBoundingClientRect().left,
                element_y = element.getBoundingClientRect().top,
                element_centerX = element_x + element.offsetWidth / 2,
                element_centerY = element_y + element.offsetHeight / 2;
            let el = this._getElement(element, element_x, element_y, element_centerX, element_centerY, this._parseLayer)
            let isParse = this._isParse(el)
            // if(!isParse && this._parseLayer < this._option.parseLayer) el.type = EGrowElementType.leafNode
            // console.log(333, el)

            if(isParse){
                el.children = this._parseHTMLElementRecurve(element, this._parseLayer+1)
            }
            element_info.push(el)

            //若anovSimpleMode=true 或者parseLayer > -1,且未匹配到相应元素，则提示
            if(this._option.anovSimpleMode){
                if(this._hasMatchEle){
                    console.warn(`${this._option.target} no match anovPart element!`)
                }
            }
        }
        
        return element_info
    }

    /**
     * 递归获取元素集合
     * @param element 传入的动画元素
     * @returns 
     */
    private _parseHTMLElementRecurve(element: HTMLElement|Element, layer: number): Array<any> {
        let element_info = [];
        if(element instanceof HTMLElement){
            let element_child = element.children,
                element_x = element.getBoundingClientRect().left,
                element_y = element.getBoundingClientRect().top;
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
                const w = (element_child[i] as HTMLDivElement).offsetWidth??element_child[i].scrollWidth;
                const h = (element_child[i] as HTMLDivElement).offsetHeight??element_child[i].scrollHeight;
                const centerX = x + w / 2;
                const centerY = y + h /2;
                let el = this._getElement(element_child[i], x, y, centerX, centerY, layer)
                let child = [], isParse = this._isParse(el)
                if(element_child[i].children.length && isParse){
                    child = this._parseHTMLElementRecurve(element_child[i], layer + 1)
                }
                el.children = child
                element_info.push(el)
                
            }
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
    private _getElement(el: HTMLElement|any, x: number, y: number, centerX: number,  centerY: number, layer?: number): IGrowHTMLElement{

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

        
        let origin_height = el.getAttribute('height')?.replace('px', '') - 0, origin_width = el.getAttribute('width')?.replace('px', '') - 0
        let opacity = Number(window.getComputedStyle(el).opacity)
        opacity = isNaN(opacity) ? 1 : opacity
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
                opacity: opacity > 1 ? 1 : opacity,
                scaleX,
                scaleY,
                transformOrigin: window.getComputedStyle(el).transformOrigin,
                width: origin_width ? (origin_width + 'px') : window.getComputedStyle(el).width ,
                height: origin_height ? (origin_height + 'px') : window.getComputedStyle(el).height 
            },
            tl: new GrowTimeLine(),
            type: this._getType(el, layer),
            grow: el.grow
        }
    }
    /**
     * 根据HTMLElement，获取动画类型
     * @param obj 动画对象
     * @returns 动画类型
     */
    private _getType(el:HTMLElement|any, layer?: number):EGrowElementType{
        let etype:EGrowElementType = EGrowElementType.none
        
        switch(el?.tagName.toUpperCase()){
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
                this._hasMatchEle= true
            }
        }else {
        //如果anovSimpleMode=false，则判断this._parseLayer和this._option.parseLayer是否相等，若相等该元素为叶子节点
            if(this._option.parseLayer > -1 && ((layer === this._option.parseLayer) )){
                if(etype !== EGrowElementType.string && etype !== EGrowElementType.number){
                    isLeafNode = true
                }
            }
        }
        if(isLeafNode){
            etype = EGrowElementType.leafNode
            el.classList.add('leaf-node')
        }

        if(isLeafNode && this._option.leafNodeType == 'sys_height'){
            el.style.height = 0
            el.style.opacity = 0
        el.style.overflow = 'auto'

        }else if(isLeafNode && this._option.leafNodeType == 'sys_width' ){
            el.style.width = 0
            el.style.opacity = 0
        el.style.overflow = 'auto'

        }else if(etype != EGrowElementType.none && (etype !== EGrowElementType.style) && (etype !== EGrowElementType.string)){
            el.style.opacity = 0
            //  el.style.overflow = 'hidden'

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

    private getPartElement(part: any, parentX: number = 0, parentY: number = 0): any{
        const  x: number = Number(part.style.left + parentX), 
               y: number = Number(part.style.top + parentY),
               centerX: number = Number(x + Number(part.style.width) / 2), 
               centerY: number = Number(y + Number(part.style.height) / 2)
        let el = document.getElementById(part.id)
        if(el){
            return {
                el,
                tagName: el?.tagName,
                x,
                y,
                w: Number(part.style.width),
                h: Number(part.style.height),
                centerX,
                centerY,
                index: 0,
                distance:  Math.sqrt(Math.pow(centerX - window.innerWidth / 2, 2) + Math.pow(centerY - window.innerHeight / 2, 2)),
                cornerDistance:  Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                children: [],
                startTime: 0, 
                endTime: 0,
                duration: 0,
                tl: this._getCompTl(part.id)
            }
        }
        
    }

    private _parsePartsConfig(parts: any, parentX?: number, parentY?: number): Array<any>{
        let els = []
        for (let i = 0; i < parts?.length; i++) {
            let part = parts[i],  child = []
            if(part.id){
                let el = this.getPartElement(part, parentX, parentY)
                els.push(el)
                if(part.children?.length > 0){
                    child = this._parsePartsConfig(part.children, el.x, el.y)
                }
                if(child.length){
                    els.push(...child)
                }
            }
            
        }
        return els
    }

    private _getCompTl(id: string): any{
        let compTl
        this._option.tls.length && this._option.tls.forEach(item => {
            // let key = Object.keys(item)[0]
            if( item.id == id) {
                compTl =  item.tl
            }
        })
        return compTl
    }


}


