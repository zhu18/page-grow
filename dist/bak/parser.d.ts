import { IDisposable, IBaseElement, IGrowHTMLElement } from './common';
/**
 * 解析器抽象类
 */
declare abstract class AbstractParser implements IDisposable {
    /**
     * 销毁解析器
     */
    abstract dispose(): void;
    abstract parse(target: any): Array<IBaseElement<any>>;
}
/**
 * 解析HTML页面元素
 */
declare class HTMLPageParser extends AbstractParser {
    constructor();
    private _els;
    dispose(): void;
    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param body 页面body元素
     * @returns IGrowHTMLElement数组
     */
    parse(body: HTMLBodyElement): Array<IGrowHTMLElement<HTMLElement>>;
    /**
     * 递归解析元素的位置与大小
     * @param element 被解析的HTML元素
     * @param x x位置
     * @param y y位置
     */
    private _parseHTMLElement;
}
export { AbstractParser, HTMLPageParser };
