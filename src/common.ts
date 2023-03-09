import { GrowTween } from "./animate"

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
    audio,
    video,
    canvas
    //...
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
    distance:number
    /**
     * 原始对象
     */
    el:object,
    /**
     * 动画开始时间
     */
     startTime: number,
     /**
      * 动画结束时间
      */
     endTime: number,
     /**
      * 动画时长
      */
     duration: number
    /**
     * 动画对象
     */
    grow?:object,
    
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
    tagName:string
    /**
     * 元素类型，不同类型有不同动画效果
     */    
    type:EGrowElementType
    /**
     * 原始对象<覆盖基类>
     */
    el:HTMLElement
    children: Array<Array<IGrowHTMLElement>>,
    /**
      * 动画时长
      */
     duration: number
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
