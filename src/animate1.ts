import { IGrowHTMLElement,EGrowElementType, StringGrowType, EGrowElementTime } from "./common"
import { EGrowType } from './rule'
import {PageGrowOption, EffectObj} from './engine'
import { gsap} from "gsap";
import SplitText from "./utils/SplitText.min";
import ScrambleTextPlugin from './utils/ScrambleTextPlugin3.min'
import {fomatterNum} from './utils/tool'

gsap.registerPlugin(ScrambleTextPlugin)

/**
 * 动画基础规则接口
 */
export declare interface IGrowAnimate{
    duration:number//动画总时长
    delay:number//延迟
    repeat:number//重复次数
    //singleTime:number //单个动画时长
    //overlapTime:number//重叠时间
    start():void
    stop():void
}

/**
 * 进场动画控制器接口
 */
export declare interface IGrowAnimateController{
    enter():void //进场
    leave():void //出场
    stop():void  //停止
    creatTl(): void //创建动画线
}

/**
 * 封装gsap
 */
export class GrowTween extends gsap.core.Tween{

}
export class GrowTimeLine extends gsap.core.Timeline{

}

/**
 * 进出场动画控制器
 */
export class HTMLGrowAnimateController implements IGrowAnimateController{
    constructor(elements:Array<IGrowHTMLElement>, opt:PageGrowOption){
        this._option = opt
        this._els = elements     
        //注册通用动画    
        this._registerEffects()
        //构建动画线      
        this._tl= gsap.timeline()
        
    }
    private _els:Array<IGrowHTMLElement>
    private _tl:gsap.core.Timeline   
    private _option:PageGrowOption

    private _init(){
        this._tl.add(this._getTl(this._els))
        return this._tl 
    }

    /**
     * 获取动画线
     * @param els 
     * @returns GrowTimeLine
     */
    private _getTl(els: Array<IGrowHTMLElement>): gsap.core.Timeline{
        let parentTl = gsap.timeline()
        parentTl.addLabel('start')
        for(let i = 0; i < els.length; i++){
            let childTl = gsap.timeline()
            childTl.addLabel('start')
            //判断该元素是否有自定义动画线
            let customTl = this._elementHasCustomTl(els[i])
            if(customTl.duration()){
                parentTl.add(customTl, 'start+=0')
            }else {
                parentTl.add(this._setElementAnimate(els[i]), 'start+=0')
                if(els[i].children.length){
                    childTl = this._getTlRecurve(els[i].children)
                }
            }
            parentTl.add(childTl, 'start+=0')
        }
        return parentTl
    }

    /**
     * 递归获取子动画线
     * @param els 
     * @returns GrowTimeLine
     */
    private _getTlRecurve(els: Array<Array<IGrowHTMLElement>>): gsap.core.Timeline{
        let parentTl = gsap.timeline()
        parentTl.addLabel('start')
        let totalMin = 0
        for(let i = 0; i < els.length; i++){
            let minDuration = 0
            let childTl = gsap.timeline()
            childTl.addLabel('start')
            
            for(let j = 0; j < els[i].length; j++){
                let tl = gsap.timeline()
                //判断该元素是否有自定义动画线
                let customTl = this._elementHasCustomTl(els[i][j])
                if(customTl.duration()){
                    tl.add(customTl, 'start+=0')
                }else {
                    tl.add(this._setElementAnimate(els[i][j]), 'start+=0')
                    if(els[i][j].children.length){
                        tl.add(this._getTlRecurve(els[i][j].children), 'start+=0')
                    }
                }
                childTl.add(tl, 'start+=0')
                minDuration = minDuration ? Math.min(minDuration, tl.duration()) :tl.duration()
            }
            //获取某一行各模块最小动画时间，与interval比较，得到下一行开始时间
            // minDuration = Math.min(minDuration, this._option.interval)
            // totalMin += minDuration
            parentTl.add(childTl, 'start+=' + i * this._option.interval)
        }
        return parentTl
    }
    public get timeLine(): gsap.core.Timeline{
        return this._tl
    }
    public get effects():Array<string>{
        let effects = Object.keys(gsap.effects)
        return effects
    }

    enter(): void {
        this._tl.play()
    }
    creatTl(): gsap.core.Timeline{
        if(!this._tl.duration()){
            
             //为所有元素初始化动画任务
             let tl = this._init()
             console.log(22,this._tl.constructor.prototype, this._tl instanceof gsap.core.Timeline)
             return tl
        }else return this._tl
    }
    leave(): void {
        this._tl.reverse()
    }
    stop():void{
        this._tl.pause()
    }
    //增加动画效果
    addEffect(effectList:Array<EffectObj>):void{
        //存在问题：未进行效果名称同名处理
        effectList.forEach(effect => {
            gsap.registerEffect({
                name: effect.id,
                defaults: { duration: 1 },
                extendTimeline: true,
                effect(targets: gsap.TweenTarget, config: { duration: 1; }) {
                  if(effect.animate === 'from'){
                    return gsap.from(targets, {...effect.props,...config })
                  } 
                  else if (effect.animate === 'fromTo'){ 
                    return gsap.fromTo(targets, {...effect.props,...config }, {...effect.props2})
                    }
                  else {
                    return gsap.to(targets, {...effect.props,...config })
                  }
                }
              });
        })
    }
    //为元素设置动画
    private _setElementAnimate(element:IGrowHTMLElement):GrowTween{
        let gt:GrowTween, duration:number
        switch(element.type){
            case EGrowElementType.chart:
                // gt=new GrowTween(element.el,{duration: 1, background:'red',opacity: 1})
                gt = gsap.effects.sys_opacity(element.el, {duration: EGrowElementTime.chart})
                break;
            case EGrowElementType.bg:
                gt = gsap.effects[this._option.bgType](element.el, {duration: EGrowElementTime.bg})
                // gt = gsap.effects[this._option.bgType](element.el, {duration: EGrowElementTime.bg, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.image:
                gt = gsap.effects[this._option.imageType](element.el, {duration: EGrowElementTime.image, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.svg:
                gt = gsap.effects[this._option.svgType](element.el, {duration: EGrowElementTime.svg})
                break;
            case EGrowElementType.canvas:
                gt = gsap.effects[this._option.canvasType](element.el, {duration: EGrowElementTime.svg})
                break;
            case EGrowElementType.video:
                gt = gsap.effects[this._option.videoType](element.el, {duration: EGrowElementTime.video})
                break;
            case EGrowElementType.string:
                gt=gsap.effects[this._option.stringType](element.el, {duration: EGrowElementTime.string})
                break;
            case EGrowElementType.number:
                gt=gsap.effects[this._option.numberType](element.el, {duration: EGrowElementTime.number, value: element.el.innerHTML})
                break;
            case EGrowElementType.bgNumber:
                gt=gsap.effects.sys_bgNumber(element.el, {duration: EGrowElementTime.bgNumber, value: element.el.innerHTML})
                break;
            case EGrowElementType.bgString:
                gt=gsap.effects.sys_bgString(element.el, {duration: EGrowElementTime.bgString, value: element.el.innerHTML})
                break;
            case EGrowElementType.leafNode:
                // gt=gsap.effects[this._option.leafNodeType](element.el, {duration: EGrowElementTime.string})
                gt=gsap.effects[this._option.leafNodeType](element.el, {duration: EGrowElementTime.bg, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.none:
                gt=new GrowTween(element.el,{duration: 0})
                break;
            default://none
                gt=new GrowTween(element.el,{duration: 0})
                break
        }

        if(element.grow){
            // 判断当前元素是否有grow，若有则使用元素自带的grow
            gt = element.grow
        }else {
            element.grow=gt
        }
        return gt
    }
    
    //注册动画类型
    private _registerEffects():void{
        //后期配置文件读入，提高可配性
        //透明度0 -> 1
        gsap.registerEffect({
            name:'sys_opacity',
            effect: (targets: gsap.TweenTarget, config: { duration: 1; }) => {
                return gsap.fromTo(targets, {opacity: 0}, {opacity: 1, duration: config.duration});
            },
        })
        //缩放
        gsap.registerEffect({
            name:'sys_scale',
            effect: (targets: HTMLElement, config: any) => {
                // return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle.opacity, scaleX: config.originalStyle.scaleX, scaleY: config.originalStyle.scaleY, transformOrigin: this._getTransformOrigin(), duration: config.duration});
                // return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle?.opacity || 1, scaleX: config.originalStyle?.scaleX || 1, scaleY: config.originalStyle?.scaleY||1,  transformOrigin: this._getTransformOrigin(), duration: config.duration});
                return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: 1, scale: 1,  transformOrigin: this._getTransformOrigin(), duration: config.duration});
            },
        })
        //高度变化
        gsap.registerEffect({
            name:'sys_height',
            effect: (targets: HTMLElement, config: { duration: 1,  originalStyle:any }) => {
                return gsap.fromTo(targets, {opacity: 0, height: 0}, {opacity: 1, height: config.originalStyle.height,  duration: config.duration});
            },
        })
        //宽度变化
        gsap.registerEffect({
            name:'sys_width',
            effect: (targets: HTMLElement, config: { duration: 1,  originalStyle:any }) => {
                return gsap.fromTo(targets, {opacity: 0, width: 0}, {opacity: 1,  width: config.originalStyle.width,  duration: config.duration});
            },
        })
        //数字
        gsap.registerEffect({
            name:'sys_number',
            effect: (targets: HTMLElement|any, config: { duration: 1, value:any, originalStyle:any }) => {
                let decimals: number = 0
                if(String(config.value).indexOf(".")>-1){
                    decimals = String(config.value).split(".")[1].length
                }
                let count = {val: 0}, hasThousander = config.value.indexOf(",") > -1 ? true : false, actualValue = 0
                //判断是否有千分符
                if(hasThousander){
                    actualValue = Number(config.value.replace(",", ""))
                }else {
                    actualValue = config.value
                }
                return gsap.to(targets, {opacity: 1, duration: 0.1, onComplete: () => {
                    gsap.to(count, {duration: config.duration, val: actualValue, onUpdate: function(){
                        if(hasThousander){
                            targets[0].innerHTML = fomatterNum(Number(count.val.toFixed(decimals)))
                        }else {
                            targets[0].innerHTML = count.val.toFixed(decimals)
                        }
                    }});
                }})
            },
        })
        //stringWave
        gsap.registerEffect({
            name:'sys_stringWave',
            effect: (targets: HTMLElement|any, config: { duration: 1}) => {
                let mySplitText  = new SplitText(targets, {type: "chars"})
                let chars = mySplitText.chars
                gsap.set(targets, {perspective:400, opacity: 1})
                return gsap.from(chars, {duration: config.duration, opacity:0, scale:0, y:80, rotationX:100, transformOrigin:"0% 50% -50", ease:"back", stagger: 0.03});
            },
        })
        //stringPrint
        gsap.registerEffect({
            name:'sys_stringPrint',
            effect: (targets: HTMLElement|any, config: { duration: 1}) => {
                let opt = {
                    text: targets[0].innerHTML,
                    chars: "_",
                    speed: 0.3,
                    ease: "none"
                }
                return gsap.to(targets, {duration: config.duration, opacity: 1, scrambleText: {...opt}})
            },
        })
        //bgString动画方式：清空动画元素内容->背景动画->背景动画完成设置元素内容->内容动画 
        // 注意： 未测试onComplete里动画时间是否体现在整体动画时间上
        gsap.registerEffect({
            name:'sys_bgString',
            effect: (targets: HTMLElement|any, config: { duration: 1}) => {
                let text = targets[0].innerHTML
                targets[0].innerHTML = ""
                return gsap.fromTo(targets, {opacity: 0}, {duration: config.duration, opacity: 1, onComplete: ()=>{
                    targets[0].innerHTML = text
                    let mySplitText  = new SplitText(targets, {type: "chars"})
                    let chars = mySplitText.chars
                    gsap.set(targets, {perspective:400})
                    gsap.from(chars, {duration: config.duration, opacity: 0, scale: 0, y: 80, rotationX: 100, transformOrigin: '0 50% -50', ease: "back", stagger: 0.01})
                }});
                
            },
        })
        //bgNumber
        gsap.registerEffect({
            name:'sys_bgNumber',
            effect: (targets: HTMLElement|any, config: { duration: 1, value: any }) => {
                let decimals:number
                if(String(config.value).indexOf(".")>-1){
                    decimals = String(config.value).split(".")[1].length
                }
                let hasThousander = config.value.indexOf(",") > -1 ? true : false, actualValue = 0
                targets[0].innerHTML = ""
                //判断是否有千分符
                if(hasThousander){
                    actualValue = Number(config.value.replace(",", ""))
                }else {
                    actualValue = config.value
                }
                return gsap.fromTo(targets, {opacity: 0}, {duration: config.duration, opacity: 1, onComplete: ()=>{
                    let count = {val: 0}
                    gsap.to(count, { duration: config.duration, val: actualValue, onUpdate: function(){
                        if(hasThousander){
                            targets[0].innerHTML = fomatterNum(Number(count.val.toFixed(decimals)))
                        }else {
                            targets[0].innerHTML = count.val.toFixed(decimals)
                        }
                        
                    }});
                }});
            },
        })
    }

    // 根据传入的动画类型获取背景图片动画
    private _getTransformOrigin():string{
        let transformOrigin:string
        switch(this._option.growType){
            case EGrowType.LeftToRight:
                transformOrigin = 'left center'
                break;
            case EGrowType.TopToBottom:
                transformOrigin = 'top center'
                break;
            case EGrowType.LeftTopToRightBottom:
                transformOrigin = 'left top '
                break;
            default: 
                transformOrigin = 'top center'
                break;
        }
        return transformOrigin
    }

    //判断元素是否有自定义动画线
    private _elementHasCustomTl(element: IGrowHTMLElement): GrowTimeLine{
        let tl:GrowTimeLine = new GrowTimeLine({})
        this._option.customTl.forEach((item ,index) => {
            if((item.target === element.el) && (item.tl instanceof  GrowTimeLine)){
                tl =  item.tl
            }
        })
        return tl
    }
}
