import { EGrowType } from './rule';
import { GrowTimeLine } from './animate';
export interface PageGrowOption {
    target: any;
    growType: EGrowType;
    interval: number;
    stringType: string;
    numberType: string;
    bgType: string;
    imageType: string;
    svgType: string;
    canvasType: string;
    videoType: string;
    leafNodeType: string;
    customTl: Array<CustomTl>;
    anovSimpleMode: boolean;
    parseLayer: number;
}
/**
 * 自定义动画对象
 */
export interface CustomTl {
    target: any;
    tl: GrowTimeLine;
}
export interface EffectObj {
    id: string;
    animate: string;
    props: object;
    props2: object;
}
export declare class PageGrow {
    option: PageGrowOption;
    private _animateController;
    constructor(opt: PageGrowOption);
    enter(): void;
    leave(): void;
    stop(): void;
    creatTl(): GrowTimeLine;
    addEffect(effectList: Array<EffectObj>): void;
}
export { gsap } from 'gsap';
