import type { IBaseElement, IGrowHTMLElement } from './common';
/**
 * 动画基础规则接口
 */
export declare interface IAnimateRule<T> {
    elements: Array<IBaseElement<T>>;
    overlapTime: number;
    sort(): void;
    exec(): void;
}
export declare class LeftToRightAnimateRule<T> implements IAnimateRule<T> {
    constructor(elements: Array<IGrowHTMLElement<T>>);
    overlapTime: number;
    elements: Array<IGrowHTMLElement<T>>;
    sort(): void;
    exec(): void;
}
