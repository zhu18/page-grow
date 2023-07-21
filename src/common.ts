import { GrowTween, GrowTimeLine } from "./animate"
import {gsap} from 'gsap'
import { Draggable } from 'gsap/Draggable'
import SplitText from "./utils/SplitText.min";
import ScrambleTextPlugin from './utils/ScrambleTextPlugin3.min'
import DrawSVGPlugin from './utils/DrawSVGPlugin3.min'
import { CustomEase } from "gsap/CustomEase";


gsap.registerPlugin(Draggable)
gsap.registerPlugin(ScrambleTextPlugin)
gsap.registerPlugin(SplitText)
gsap.registerPlugin(CustomEase)
gsap.registerPlugin(DrawSVGPlugin)



gsap.SplitText = SplitText

const pageGrowGsap = gsap
export {pageGrowGsap}


/**
 * 动画对象类型
 */
export  enum EGrowElementType{
    number,
    string,    
    image,
    chart,
    none,
    svg,
    bg,
    video,
    canvas,
    bgString,
    bgNumber,
    style,
    leafNode,
    //...
}


export  enum EGrowElementTime{
    number=0.3,
    string=0.3,    
    image=0.6,
    chart=0.6,
    none=0,
    svg=0.2,
    bg=0.6,
    audio=0.3,
    video=0.5,
    canvas=0.2,
    bgString=0.3,
    bgNumber=0.3
    //...
}


// 字符串动画类型
export enum StringGrowType{
    wave=1,
    print=2
}

/**
 * 动画对象接口
 */
export declare interface IGrowElement{   
    x:number
    y:number
    w:number
    h:number
    centerX:number
    centerY:number
    distance:number,
    cornerDistance: number,
    /**
     * 原始对象
     */
    el:HTMLElement | null,
    /**
     * 动画开始时间
     */
     startTime: any,
     /**
      * 动画结束时间
      */
     endTime: number,
     /**
      * 动画时长
      */
     duration: number,
    /**
     * 动画对象
     */
    grow?:object,
    /**
     * 元素原始样式()目前包含opacity, scaleX, scaleY
     */
    originalStyle?:any
    
}

/**
 * HTML动画对象接口
 */
export declare interface IGrowHTMLElement extends IGrowElement{
    /**
     * 进出场顺序
     */
    index:number 
    /**
     * 元素tagName
     */                   
    tagName:string|undefined
    
    /**
     * 原始对象<覆盖基类>
     */
    el:HTMLElement,
    children: Array<Array<IGrowHTMLElement>>,
    /**
      * 动画时长
      */
     duration: number,
     tl: GrowTimeLine
    /**
     * 元素类型，不同类型有不同动画效果
     */    
     type?:EGrowElementType
     /**
     * 动画对象<覆盖基类>
     */
    grow?:GrowTween
    
    
    
}


/**
 * 销毁接口
 */
export declare interface IDisposable {
    /**
     * Releases all held resources
     */
    dispose(): void;
}
