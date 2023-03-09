import { IGrowHTMLElement } from "./common";
import { gsap } from "gsap";
/**
 * 动画基础规则接口
 */
export declare interface IGrowAnimate {
    duration: number;
    delay: number;
    repeat: number;
    start(): void;
    stop(): void;
}
/**
 * 进场动画控制器接口
 */
export declare interface IGrowAnimateController {
    enter(): void;
    leave(): void;
    stop(): void;
}
/**
 * 封装gsap
 */
export declare class GrowTween extends gsap.core.Tween {
}
export declare class GrowTimeLine extends gsap.core.Timeline {
}
/**
 * 进出场动画控制器
 */
export declare class HTMLGrowAnimateController implements IGrowAnimateController {
    constructor(elements: Array<IGrowHTMLElement>);
    private _els;
    private _tl;
    private _index;
    private _init;
    /**
     * 获取动画线
     * @param els
     * @returns GrowTimeLine
     */
    private _getTl;
    /**
     * 递归获取子动画线
     * @param els
     * @returns GrowTimeLine
     */
    private _getTlRecurve;
    get timeLine(): GrowTimeLine;
    enter(): void;
    leave(): void;
    stop(): void;
    private _setElementAnimate;
    private _registerEffects;
}
