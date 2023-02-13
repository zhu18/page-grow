import type {IDisposable, IBaseElement,IGrowHTMLElement} from './common'
/**
 * 动画基础规则接口
 */
export declare interface IAnimateRule<T>{
    elements:Array<IBaseElement<T>>
    //totalTime:number//动画总时长
    //singleTime:number //单个动画时长
    overlapTime:number//重叠时间
    sort():void
    exec():void
}

export class LeftToRightAnimateRule<T> implements IAnimateRule<T>{
    constructor(elements:Array<IGrowHTMLElement<T>>){
        this.elements=elements
    }
    overlapTime:number=0
    elements: Array<IGrowHTMLElement<T>>
    sort(): void {
        this.elements.sort((a, b) => {
            if (a.y !== b.y) {
                return a.y - b.y;
            }
            return a.x - b.x;
        });
    }
    exec(): void {
        throw new Error("Method not implemented.")
    }  
}

