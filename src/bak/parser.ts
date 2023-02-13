import {IDisposable, IBaseElement, IGrowHTMLElement, GrowElementType} from './common'
import type {IParserRule, LeftToRightHTMLParserRule}  from './rule'
/**
 * 解析器抽象类
 */
abstract class AbstractParser implements IDisposable{
    /**
     * 销毁解析器
     */
    public abstract dispose(): void;

    public abstract parse(target:any): Array<IBaseElement<any>>;
}



/**
 * 解析HTML页面元素
 */
class HTMLPageParser extends AbstractParser{
    constructor(){
        super()
        this._els=Array<IGrowHTMLElement<HTMLElement>>()
        
    }

   // private _parserRule:IParserRule<HTMLElement>
    private _els:Array<IGrowHTMLElement<HTMLElement>>

    public dispose(): void {
        this._els.length=0
    }


    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param body 页面body元素
     * @returns IGrowHTMLElement数组
     */
    public parse(body:HTMLBodyElement): Array<IGrowHTMLElement<HTMLElement>> {
        this._parseHTMLElement(body??document.body)
        return this._els
    }


    /**
     * 递归解析元素的位置与大小
     * @param element 被解析的HTML元素
     * @param x x位置
     * @param y y位置
     */
    private _parseHTMLElement(element:HTMLElement|any, x = 0, y = 0): void {
        x += element.offsetLeft - (element.offsetParent?.clientLeft??0);
        y += element.offsetTop - (element.offsetParent?.clientTop??0);
        const h = element.offsetHeight
        const w = element.offsetWidth
        console.log(element)
        //if (element instanceof HTMLElement) {  对iframe内嵌页面 判断未知，初步估计v8引擎bug, iframe中的DOM元素，并且不能将其视为主文档HTMLElement类型的对象
        if(element.nodeType===1){
            this._els.push({
                    el: element,
                    index: 0,
                    tagName:element.tagName,
                    type:GrowElementType.string,
                    x,
                    y,
                    w,
                    h
                }
            )
            console.log(`Element: ${element.nodeName}`);
            console.log(`Parent: ${element.parentNode?.nodeName}`);
            console.log(`Position: (${x}, ${y})`);
            console.log(`Height: ${h}`);
            console.log(`Width: ${w}`);
            console.log("");
        }
        //}
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes[i];
            if(child.nodeType===1){
           // if (child instanceof HTMLElement) {
                this._parseHTMLElement(child, x + element.offsetLeft, y + element.offsetTop);
          //}
            }
        }
    }
}



export { AbstractParser, HTMLPageParser }