import { GrowTween, GrowTimeLine } from "./animate";
declare const pageGrowGsap: typeof globalThis.gsap;
export { pageGrowGsap };
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
    video = 7,
    canvas = 8,
    bgString = 9,
    bgNumber = 10,
    style = 11,
    leafNode = 12
}
export declare enum EGrowElementTime {
    number = 0.2,
    string = 0.2,
    image = 0.3,
    chart = 0.3,
    none = 0,
    svg = 0.2,
    bg = 0.2,
    audio = 0.3,
    video = 0.5,
    canvas = 0.2,
    bgString = 0.3,
    bgNumber = 0.3
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
    cornerDistance: number;
    /**
     * 原始对象
     */
    el: HTMLElement | null;
    /**
     * 动画开始时间
     */
    startTime: any;
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
    originalStyle?: any;
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
    tagName: string | undefined;
    /**
     * 原始对象<覆盖基类>
     */
    el: HTMLElement;
    children: Array<Array<IGrowHTMLElement>>;
    /**
      * 动画时长
      */
    duration: number;
    tl: GrowTimeLine;
    /**
     * 元素类型，不同类型有不同动画效果
     */
    type?: EGrowElementType;
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
