import { EGrowElementType, IGrowElement,IGrowHTMLElement} from './common'

/**
 * 解析规则接口
 */
export declare interface IParserRule{   
    exec(elements:Array<IGrowElement>):void
}


/**
 * 左上到右下解析规则
 */
export class LeftTopToRightBottomParserRule implements IParserRule{    
    exec(elements:Array<IGrowElement>): void {
        //LeftTopToRightBottom 进场排序
        // elements.sort((a, b) => {
        //     if (a.y !== b.y) {
        //         return a.y - b.y;
        //     }
        //     return a.x - b.x;
        // });       
    }   
}

/**
 * 上到下解析规则
 */
export class TopToBottomParserRule implements IParserRule{    
    exec(elements:Array<IGrowElement>): void {
          //CenterToAround 进场排序
          elements = getOrderTopToBottom(elements)
          console.log(elements)
        //   elements.sort((a, b) => a.distance - b.distance);
    }   
}

/**
 * 中间到周围解析规则
 */
export class CenterToAroundParserRule implements IParserRule{    
    exec(elements:Array<IGrowHTMLElement>): void {
         //CenterToAround 进场排序
        elements.sort((a, b) => a.distance - b.distance);
    }   
}

/**
 * 解析规则工厂，通过参数配置生成解析规则
 */
export class RuleFactory{
    public static create(opt:RuleOption):IParserRule{
        var rule:IParserRule
        switch(opt.growType){
            case EGrowType.LeftTopToRightBottom:
                rule=new LeftTopToRightBottomParserRule()
                break
            case EGrowType.TopToBottom:
                rule=new TopToBottomParserRule()
                break
            case EGrowType.CenterToAround:
                rule=new CenterToAroundParserRule()
                break
            default:
                rule=new LeftTopToRightBottomParserRule()
            break
        }
        return rule
    }
}

/**
 * 解析规则配置
 */
export interface RuleOption{
    growType:EGrowType; //动画进场方式
}

/**
 * 进场动画方式
 */
export enum EGrowType{
    LeftToRight=1,
    RightToLeft=2,
    TopToBottom=3,
    BottomToTop=4,
    LeftTopToRightBottom=5,
    CenterToAround=6
    // 待扩展..
}

function getOrderTopToBottom(elements:Array<IGrowElement>): Array<IGrowElement>{
    let orderArr = orderTopToBottom(elements)
    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            // let order: Array<IGrowHTMLElement> = []
            // if(orderArr[i][j].children.length){
            //     order = getOrderTopToBottom(orderArr[i][j].children)
            // }
            // orderArr[i][j].order = order
            orderArr[i][j].children = getOrderTopToBottom(orderArr[i][j].children)
        }
    }
    return orderArr
}
function orderTopToBottom(elements:Array<IGrowElement>): any{
    let t, n = elements.length;
    for(let i = 1; i < n; i++){
        for(let j = 0; j < n-i; j++){
            if(elements[j].y == elements[j+1].y && elements[j].x > elements[j+1].x){
                t = elements[j];
                elements[j]=elements[j+1];
                elements[j+1]= t;
            }else if(elements[j].y > elements[j+1].y){
                t = elements[j];
                elements[j]=elements[j+1];
                elements[j+1]= t;
            }
        }
    }
    let newArr = []
    for(let i = 0; i < elements.length; i++){
        if(newArr.length){
            let hasFlag = false
            for(let m = 0; m < newArr.length; m++){
                if(newArr[m][0].y === elements[i].y){
                    newArr[m].push(elements[i])
                    hasFlag = true
                }
            }
            if(!hasFlag){
                newArr.push([elements[i]])
            }
        }else {
            newArr.push([elements[i]])
        }
    }
    return newArr;
}