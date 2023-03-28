import { IGrowHTMLElement,EGrowElementType, StringGrowType } from "./common"
import { EGrowType } from './rule'
import {PageGrowOption} from './engine'
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
        this._tl=new GrowTimeLine({
            paused: true
        })
        //为所有元素初始化动画任务
        this._init()

        
    }
    private _els:Array<IGrowHTMLElement>
    private _tl:GrowTimeLine   
    private _option:PageGrowOption

    private _init(){
        this._tl.addLabel('start')
        this._tl.add(this._getTl(this._els))
    }

    /**
     * 获取动画线
     * @param els 
     * @returns GrowTimeLine
     */
    private _getTl(els: Array<IGrowHTMLElement>): GrowTimeLine{
        let parentTl = new GrowTimeLine()
        parentTl.addLabel('start')
        for(let i = 0; i < els.length; i++){
            let childTl = new GrowTimeLine()
            childTl.addLabel('start')
            parentTl.add(this._setElementAnimate(els[i]), 'start+='+els[i].startTime )
            if(els[i].children.length){
                childTl = this._getTlRecurve(els[i].children)
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
    private _getTlRecurve(els: Array<Array<IGrowHTMLElement>>): GrowTimeLine{
        let parentTl = new GrowTimeLine()
        parentTl.addLabel('start')
        
        for(let i = 0; i < els.length; i++){

            let childTl = new GrowTimeLine()
            childTl.addLabel('start')
            
            for(let j = 0; j < els[i].length; j++){
                let tl = new GrowTimeLine()
                tl.add(this._setElementAnimate(els[i][j]), 'start+='+els[i][j].startTime)
                if(els[i][j].children.length){
                    tl.add(this._getTlRecurve(els[i][j].children))
                }
                childTl.add(tl, 'start+='+ els[i][j].startTime)
            }
            parentTl.add(childTl, 'start')

        }
        return parentTl

    }
    public get timeLine(): GrowTimeLine{
        return this._tl
    }

    enter(): void {
      this._tl.play()
    }
    leave(): void {
        this._tl.reverse()
    }
    stop():void{
        this._tl.pause()
    }
    //为元素设置动画
    private _setElementAnimate(element:IGrowHTMLElement):GrowTween{
        let gt:GrowTween, duration:number
        switch(element.type){
            case EGrowElementType.chart:
                // gt=new GrowTween(element.el,{duration: 1, background:'red',opacity: 1})
                gt = gsap.effects.chart(element.el, {duration: element.duration})
                break;
            case EGrowElementType.bg:
                gt = gsap.effects.bg(element.el, {duration: element.duration, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.image:
                gt = gsap.effects.bg(element.el, {duration: element.duration, originalStyle: element.originalStyle})
                break;
            case EGrowElementType.svg:
                gt = gsap.effects.svg(element.el, {duration: element.duration})
                break;
            case EGrowElementType.video:
                gt = gsap.effects.video(element.el, {duration: element.duration})
                break;
            case EGrowElementType.string:
                let type:string
                duration = Math.max(element.duration, this._option.stringDurationThreshold)
                switch(this._option.stringType){
                    case StringGrowType.wave:
                        type = "stringWave"
                        break;
                    case StringGrowType.print:
                        type = "stringPrint"
                        break;
                    default:
                        type = "stringPrint"
                        break;
                }
                gt=gsap.effects[type](element.el, {duration: duration})
                break;
            case EGrowElementType.number:
                duration = Math.max(element.duration, this._option.numberDurationThreshold)
                gt=gsap.effects.number(element.el, {duration: duration, value: element.el.innerHTML})
                break;
            case EGrowElementType.bgNumber:
                duration = Math.max(element.duration, this._option.numberDurationThreshold)
                gt=gsap.effects.bgNumber(element.el, {duration: duration, value: element.el.innerHTML})
                break;
            case EGrowElementType.bgString:
                duration = Math.max(element.duration, this._option.stringDurationThreshold)
                gt=gsap.effects.bgString(element.el, {duration: duration, value: element.el.innerHTML})
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
        //chart
        gsap.registerEffect({
            name:'chart',
            effect: (targets: gsap.TweenTarget, config: { duration: 1; }) => {
                return gsap.fromTo(targets, {opacity: 0}, {opacity: 1, duration: config.duration});
            },
        })
        //背景
        gsap.registerEffect({
            name:'bg',
            effect: (targets: HTMLElement, config: any) => {
                // return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle.opacity, scaleX: config.originalStyle.scaleX, scaleY: config.originalStyle.scaleY, transformOrigin: this._getTransformOrigin(), duration: config.duration});
                return gsap.fromTo(targets, {opacity: 0, scale: 0}, {opacity: config.originalStyle.opacity || 1, scaleX: config.originalStyle.scaleX, scaleY: config.originalStyle.scaleY,  transformOrigin: this._getTransformOrigin(), duration: config.duration});
            },
        })
        //svg
        gsap.registerEffect({
            name:'svg',
            effect: (targets: gsap.TweenTarget, config: { duration: 1; }) => {
                return gsap.to(targets, {duration: config.duration, opacity: 1});
            },
        })
        //image
        gsap.registerEffect({
            name:'image',
            effect: (targets: gsap.TweenTarget, config: any) => {
                return gsap.from(targets, {opacity: 0, scale: 0, transformOrigin: this._getTransformOrigin(), duration: config.duration});
            },
        })
        //video
        gsap.registerEffect({
            name:'video',
            effect: (targets: gsap.TweenTarget, config: { duration: 1; }) => {
                return gsap.to(targets, {duration: config.duration, opacity: 1});
            },
        })
        //数字
        gsap.registerEffect({
            name:'number',
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
            name:'stringWave',
            effect: (targets: HTMLElement|any, config: { duration: 1}) => {
                let mySplitText  = new SplitText(targets, {type: "chars"})
                let chars = mySplitText.chars
                gsap.set(targets, {perspective:400, opacity: 1})
                return gsap.from(chars, {duration: config.duration, opacity:0, scale:0, y:80, rotationX:100, transformOrigin:"0% 50% -50", ease:"back", stagger: 0.03});
            },
        })
        //stringPrint
        gsap.registerEffect({
            name:'stringPrint',
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
            name:'bgString',
            effect: (targets: HTMLElement|any, config: { duration: 1}) => {
                let text = targets[0].innerHTML
                targets[0].innerHTML = ""
                return gsap.fromTo(targets, {opacity: 0}, {duration: this._option.bgDurationThreshold, opacity: 1, onComplete: ()=>{
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
            name:'bgNumber',
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
                return gsap.fromTo(targets, {opacity: 0}, {duration: this._option.bgDurationThreshold, opacity: 1, onComplete: ()=>{
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
            default: 
                transformOrigin = 'top center'
                break;
        }
        return transformOrigin
    }
}
