import type { IParserRule } from './rule';
import { IDisposable, IGrowElement, IGrowHTMLElement } from './common';
import { PageGrowOption } from './engine';
/**
 * 解析器抽象类
 */
export declare abstract class AbstractParser implements IDisposable {
    /**
     * 销毁解析器
     */
    abstract dispose(): void;
    /**
     * 解析指定对象，编排所有子元素规则
     * @param target 被解析的父级对象
     */
    abstract parse(target: any): Array<IGrowElement>;
}
/**
 * 解析HTML页面元素
 */
export declare class HTMLPageParser extends AbstractParser {
    constructor(rule: IParserRule);
    private _rule;
    private _els;
    private _option;
    private _parseLayer;
    private _hasMatchEle;
    get rule(): IParserRule;
    get elements(): Array<IGrowHTMLElement>;
    dispose(): void;
    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param opt 配置参数
     * @returns IGrowHTMLElement数组
     */
    parse(opt: PageGrowOption): Array<IGrowHTMLElement>;
    /**
     * 获取元素集合
     * @param element 传入的动画元素
     * @returns
     */
    private _parseHTMLElement;
    /**
     * 递归获取元素集合
     * @param element 传入的动画元素
     * @returns
     */
    private _parseHTMLElementRecurve;
    /**
     * 获取元素对象
     * @param el 元素
     * @param x 元素位置x
     * @param y 元素位置y
     * @param centerX 元素中心点坐标x
     * @param centerY 元素中心点坐标y
     * @returns
     */
    private _getElement;
    /**
     * 根据HTMLElement，获取动画类型
     * @param obj 动画对象
     * @returns 动画类型
     */
    private _getType;
    /**
     * 判断是否遍历元素子元素
     * @param el
     * @returns
     */
    private _isParse;
    private getPartElement;
    private _parsePartsConfig;
    private _getCompTl;
    private _getStartTime;
    private _hasTextAndTag;
}
