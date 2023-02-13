import type {IParserRule}  from './rule'
import {EGrowElementType, IDisposable, IGrowElement, IGrowHTMLElement, } from './common'
import { GrowTween } from './animate'


/**
 * 解析器抽象类
 */
export abstract class AbstractParser implements IDisposable{
    /**
     * 销毁解析器
     */
    public abstract dispose(): void;

    /**
     * 解析指定对象，编排所有子元素规则
     * @param target 被解析的父级对象
     */
    public abstract parse(target:any): Array<IGrowElement>;
}


/**
 * 解析HTML页面元素
 */
export class HTMLPageParser extends AbstractParser{
    constructor(rule:IParserRule){
        super()
        this._rule=rule
    }    

    private _rule:IParserRule
    private _els:IGrowHTMLElement[]=Array<IGrowHTMLElement>()

    public get rule():IParserRule{
        return this._rule
    }
    public get elements():IGrowHTMLElement[]{
        return this._els
    }

    public dispose(): void {
        this._els.length=0
    }


    /**
     * 解析HTML页面全部元素, 获取IGrowHTMLElement数组
     * @param body 页面body元素
     * @returns IGrowHTMLElement数组
     */
    public parse(body:HTMLElement): Array<IGrowHTMLElement> {
        //初始化所有元素基础信息
        this._parseHTMLElement(body??document.body)
        //通过规则重新排序
        this._rule.exec(this._els)        
        //重置索引
        this._els.forEach((el,i)=>{
            el.index=i
        })
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
        let centerX = x + element.offsetWidth / 2;
        let centerY = y + element.offsetHeight / 2;
        //if (element instanceof HTMLElement) {  对iframe内嵌页面 判断未知，初步估计v8引擎bug, iframe中的DOM元素，并且不能将其视为主文档HTMLElement类型的对象
        if(element.nodeType===1){
            this._els.push({
                    el: element,
                    tagName:element.tagName,                   
                    x,
                    y,
                    w,
                    h,
                    centerX,
                    centerY,
                    distance: Math.sqrt(Math.pow(centerX - window.innerWidth / 2, 2) + Math.pow(centerY - window.innerHeight / 2, 2)),
                    type:this._getType(element),
                    //解析后重置
                    index: 0
                }
            )
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

    /**
     * 根据HTMLElement，获取动画类型
     * @param obj 动画对象
     * @returns 动画类型
     */
    private _getType(el:HTMLElement|any):EGrowElementType{
        let etype:EGrowElementType=EGrowElementType.string
        
        switch(el.tagName.toUpperCase()){
            case "DIV":
                etype = EGrowElementType.chart
                // echarts
                // if(el.hasAttribute('_echarts_instance_'))
                // {
                //     etype = EGrowElementType.chart
                // }
                break;
            case "IMG":
                etype = EGrowElementType.image
                break;
            case "BODY":
                etype = EGrowElementType.none
                break;
            default:
                etype = EGrowElementType.string
                break;
        }
        return etype
    }
}


