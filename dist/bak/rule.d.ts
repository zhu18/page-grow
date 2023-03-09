import type { IBaseElement, IGrowHTMLElement } from './common';
/**
 * 基础解析规则接口
 */
export declare interface IParserRule<T> {
    exec(elements: Array<IBaseElement<T>>): void;
}
export declare class LeftToRightHTMLParserRule<T> implements IParserRule<T> {
    constructor();
    exec(elements: Array<IGrowHTMLElement<T>>): void;
}
export declare class RuleFactory {
    static create<T>(): IParserRule<T>;
}
