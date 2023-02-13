import { IGrowHTMLElement,EGrowElementType } from "./common"
import { gsap } from "gsap";

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
    constructor(elements:Array<IGrowHTMLElement>){
        this._els=elements       
        //注册通用动画    
        this._registerEffects()

        //构建动画线      
        this._tl=new GrowTimeLine()
        //为所有元素初始化动画任务
        this._init()
    }
    private _els:Array<IGrowHTMLElement>    
    private _tl:GrowTimeLine   

    private _init(){
        this._tl.addLabel('start')
        //规划动画线
        this._els.forEach((element)=>{
            if(element.type!=EGrowElementType.none)
                // this._tl.to(element.el,{duration: .5,background:'#88ff88',opacity: 1},'>-.2')
                // gsap.to(element.el,{duration: .5,background:'#88ff88',opacity: 1,delay:element.index*.2})
                // let vars=this._getElementAnimate(element).vars
                this._tl.to(element.el,{duration: .3,background:'#88ff88',opacity: 1},"start+="+(element.index*.1))
                // this._setElementAnimate(element)
                // this._tl.to(element.el,{duration: 1, background:'blue',opacity: 1}, '>-0.5')
                
                // this._tl.to(element.el, {...vars, delay:element.index*0.5})
                // this._tl.to(element.el, vars, '>-.2')
        })
        
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
    //为元素设置动画并添加到动画线
    private _setElementAnimate(element:IGrowHTMLElement):GrowTween{
        let gt:GrowTween
        switch(element.type){
            case EGrowElementType.chart:
                gt=new GrowTween(element.el,{duration: 1, background:'red',opacity: 1})
                break;
            case EGrowElementType.image:
                gt=new GrowTween(element.el,{duration: 1, background:'blue',opacity: 1})
                break;
            case EGrowElementType.string:
                gt=new GrowTween(element.el,{duration: 1, color:'#ff9933',opacity: 1})
                break;
            case EGrowElementType.none:
                gt=new GrowTween(element.el,{duration: 0,opacity: 1})
                break;
            default://none
                gt=new GrowTween(element.el,{duration: 0,opacity: 1})
                break
        }
        gt.delay(element.index*.2)
        element.grow=gt
        return gt
    }
    
    //注册动画类型
    private _registerEffects():void{
        //后期配置文件读入，提高可配性
        //chart
        gsap.registerEffect({
            name:'chart',
            effect: (targets: gsap.TweenTarget, config: { duration: 1; }) => {
                return gsap.to(targets, {duration: config.duration, opacity: 1});
            },
        })
    }
}
