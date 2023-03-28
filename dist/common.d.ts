import { GrowTween } from "./animate";
/**
 * 动画对象类型
 */
export declare enum EGrowElementType {
    number = 0,
    string = 1,
    image = 2,
    chart = 3,
    none = 4,
    svg = 5,
    bg = 6,
    audio = 7,
    video = 8,
    canvas = 9,
    bgString = 10,
    bgNumber = 11,
    style = 12
}
export declare enum StringGrowType {
    wave = 1,
    print = 2
}
/**
 * 动画对象接口
 */
export declare interface IGrowElement {
    x: number;
    y: number;
    w: number;
    h: number;
    centerX: number;
    centerY: number;
    distance: number;
    /**
     * 原始对象
     */
    el: object;
    /**
     * 动画开始时间
     */
    startTime: number;
    /**
     * 动画结束时间
     */
    endTime: number;
    /**
     * 动画时长
     */
    duration: number;
    /**
     * 动画对象
     */
    grow?: object;
    /**
     * 元素原始样式()目前包含opacity, scaleX, scaleY
     */
    originalStyle?: object;
}
/**
 * HTML动画对象接口
 */
export declare interface IGrowHTMLElement extends IGrowElement {
    /**
     * 进出场顺序
     */
    index: number;
    /**
     * 元素tagName
     */
    tagName: string;
    /**
     * 元素类型，不同类型有不同动画效果
     */
    type: EGrowElementType;
    /**
     * 原始对象<覆盖基类>
     */
    el: HTMLElement;
    children: Array<Array<IGrowHTMLElement>>;
    /**
      * 动画时长
      */
    duration: number;
    /**
    * 动画对象<覆盖基类>
    */
    grow?: GrowTween;
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
