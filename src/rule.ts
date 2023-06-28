import { EGrowElementType, IGrowElement,IGrowHTMLElement} from './common'
import {PageGrowOption} from './engine'


/**
 * 进场动画方式
 */
export enum EGrowType{
    LeftToRight=1,
    TopToBottom=2,
    LeftTopToRightBottom=3,
    RightToLeft=4,
    BottomToTop=5,
    CenterToAround=6
    // 待扩展..
}


/**
 * 解析规则工厂，通过参数配置生成解析规则
 */
 export class RuleFactory{
    public static create(opt:PageGrowOption):IParserRule{
        var rule:IParserRule
        switch(opt.growType){
            case EGrowType.LeftTopToRightBottom:
                rule=new LeftTopToRightBottomParserRule()
                break
            case EGrowType.TopToBottom:
                rule=new TopToBottomParserRule()
                break
            case EGrowType.LeftToRight:
                rule=new LeftToRightParserRule()
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
       // lerftTopToRightBottom 进场排序    
       elements = getOrderLeftTopToRightBottom(elements)
    }   
}

/**
 * 上到下解析规则
 */
export class TopToBottomParserRule implements IParserRule{    
    exec(elements:Array<IGrowElement>): void {
          //TopToBottom 进场排序
          elements = getOrderTopToBottom(elements)

    }   
}
/**
 * 左到右解析规则
 */
 export class LeftToRightParserRule implements IParserRule{    
    exec(elements:Array<IGrowElement>): void {
          //LeftToRight 进场排序
        elements  = getOrderLeftToRight(elements)
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
 * 从上到下——递归获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns 
 */
function getOrderTopToBottom(elements:Array<IGrowElement>): Array<IGrowHTMLElement>{
    let orderArr = orderTopToBottom(elements)
    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            if(orderArr[i][j].children.length){
                orderArr[i][j].children = getOrderTopToBottom(orderArr[i][j].children)
            }
        }
    }
    return orderArr
}
/**
 * 从上到下——根据元素y值排序
 * @param elements 
 * @returns 排序后得到二维数组
 */
function orderTopToBottom(elements:Array<IGrowElement>): any{
    let t, n = elements.length;
    // 按元素y值进行排序，得到一个一维数组
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
    // 元素值相等，放入同一数组，最终得到二维数组
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

/**
 * 从左到右——获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns 
 */
 function getOrderLeftToRight(elements:Array<IGrowElement>): Array<IGrowHTMLElement>{
    let orderArr = orderLeftToRight(elements)
    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            if(orderArr[i][j].children.length){
                 orderArr[i][j].children = getOrderLeftToRight(orderArr[i][j].children)
            }
        }
    }
    return orderArr
}
/**
 * 从左到右——递归获取排序后的元素对象
 * @param elements 
 * @returns 
 */
function orderLeftToRight(elements:Array<IGrowElement>): any{
    let t, n = elements.length;
    for(let i = 1; i < n; i++){
        for(let j = 0; j < n-i; j++){
            if(elements[j].x == elements[j+1].x && elements[j].y > elements[j+1].y){
                t = elements[j];
                elements[j]=elements[j+1];
                elements[j+1]= t;
            }else if(elements[j].x > elements[j+1].x){
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
                if(newArr[m][0].x === elements[i].x){
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

function getOrderLeftTopToRightBottom(elements:Array<IGrowElement>): Array<IGrowHTMLElement>{
    let orderArr = orderLeftTopToRightBottom(elements)

    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            if(orderArr[i][j].children.length){
                orderArr[i][j].children = getOrderLeftTopToRightBottom(orderArr[i][j].children)
           }
        }
    }
    return orderArr
}
function orderLeftTopToRightBottom(elements:Array<IGrowElement>): any{
    let t, n = elements.length;
    for(let i = 1; i < n; i++){
        for(let j = 0; j < n-i; j++){

            if(elements[j].cornerDistance == elements[j+1].cornerDistance && elements[j].y > elements[j+1].y){
                t = elements[j];
                elements[j]=elements[j+1];
                elements[j+1]= t;
            }else if(elements[j].cornerDistance > elements[j+1].cornerDistance){
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
                if(newArr[m][0].cornerDistance === elements[i].cornerDistance){
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