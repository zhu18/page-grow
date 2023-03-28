import { IGrowElement, IGrowHTMLElement } from './common';
import { PageGrowOption } from './engine';
/**
 * 解析规则配置
 */
export interface RuleOption {
    growType: EGrowType;
}
/**
 * 进场动画方式
 */
export declare enum EGrowType {
    LeftToRight = 1,
    RightToLeft = 2,
    TopToBottom = 3,
    BottomToTop = 4,
    LeftTopToRightBottom = 5,
    CenterToAround = 6
}
/**
 * 解析规则接口
 */
export declare interface IParserRule {
    exec(elements: Array<IGrowElement>): void;
}
/**
 * 左上到右下解析规则
 */
export declare class LeftTopToRightBottomParserRule implements IParserRule {
    exec(elements: Array<IGrowElement>): void;
}
/**
 * 上到下解析规则
 */
export declare class TopToBottomParserRule implements IParserRule {
    exec(elements: Array<IGrowElement>): void;
}
/**
 * 左到右解析规则
 */
export declare class LeftToRightParserRule implements IParserRule {
    exec(elements: Array<IGrowElement>): void;
}
/**
 * 中间到周围解析规则
 */
export declare class CenterToAroundParserRule implements IParserRule {
    exec(elements: Array<IGrowHTMLElement>): void;
}
/**
 * 解析规则工厂，通过参数配置生成解析规则
 */
export declare class RuleFactory {
    static create(opt: PageGrowOption): IParserRule;
}
