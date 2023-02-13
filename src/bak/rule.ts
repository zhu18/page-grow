import type { IBaseElement,IGrowHTMLElement} from './common'
/**
 * 基础解析规则接口
 */
export declare interface IParserRule<T>{   
    exec(elements:Array<IBaseElement<T>>):void
}

export class LeftToRightHTMLParserRule<T> implements IParserRule<T>{
    constructor(){
        
    }
    exec(elements:Array<IGrowHTMLElement<T>>): void {
        elements.sort((a, b) => {
            if (a.y !== b.y) {
                return a.y - b.y;
            }
            return a.x - b.x;
        });
    }   
}

export class RuleFactory{
    public static create<T>():IParserRule<T>{
        return new LeftToRightHTMLParserRule<T>()
    }
}
