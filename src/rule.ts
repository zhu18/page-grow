import { EGrowElementType, IGrowElement,IGrowHTMLElement} from './common'
import {PageGrowOption} from './engine'

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
          //TopToBottom 进场排序
          let ele = getOrderTopToBottom(elements)
          elements = setTopToBottomTime(ele)
          
        //   elements.sort((a, b) => a.distance - b.distance);
    }   
}
/**
 * 左到右解析规则
 */
 export class LeftToRightParserRule implements IParserRule{    
    exec(elements:Array<IGrowElement>): void {
          //LeftToRight 进场排序
          let ele  = getOrderLeftToRight(elements)
          elements = setLeftToRightTime(ele)
          console.log(11,elements)

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
 * 从上到下——获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns 
 */
function getOrderTopToBottom(elements:Array<IGrowElement>): Array<Array<IGrowHTMLElement>>{
    
    let orderArr = orderTopToBottom(elements)

    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            orderArr[i][j].children = getOrderTopToBottom(orderArr[i][j].children)
        }
    }
    return orderArr
}
/**
 * 从上到下——递归获取排序后的元素对象
 * @param elements 
 * @returns 
 */
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
/**
 * 从上到下——计算各元素的动画开始、结束时间及动画时长
 * @param elements 
 * @param parentEle 
 * @returns 
 */
 function setTopToBottomTime(elements:Array<Array<IGrowHTMLElement>>, parentEle?:IGrowHTMLElement ): any{
    for(let i = 0; i < elements.length; i++){
        for(let j = 0; j < elements[i].length; j++){
            if(parentEle){
                elements[i][j].startTime = elements[i][j].y / parentEle.h * parentEle.duration
                elements[i][j].duration = elements[i][j].h / parentEle.h * parentEle.duration
            }
            elements[i][j].endTime = elements[i][j].startTime + elements[i][j].duration
            if(elements[i][j].children.length){
                elements[i][j].children = setTopToBottomTime(elements[i][j].children, elements[i][j])
            }
        }
    }
    return elements
}


/**
 * 从左到右——获取排序后的对象
 * @param elements 需排序的元素对象
 * @returns 
 */
 function getOrderLeftToRight(elements:Array<IGrowElement>): Array<Array<IGrowHTMLElement>>{
    let orderArr = orderLeftToRight(elements)
    for(let i = 0; i < orderArr.length; i++){
        for(let j = 0 ; j < orderArr[i].length; j++){
            orderArr[i][j].children = getOrderLeftToRight(orderArr[i][j].children)
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
/**
 * 从左到右——计算各元素的动画开始、结束时间及动画时长
 * @param elements 
 * @param parentEle 
 * @returns 
 */
function setLeftToRightTime(elements:Array<Array<IGrowHTMLElement>>, parentEle?:IGrowHTMLElement ): any{
    for(let i = 0; i < elements.length; i++){
        for(let j = 0; j < elements[i].length; j++){
            if(parentEle){
                elements[i][j].startTime = elements[i][j].x / parentEle.w * parentEle.duration
                elements[i][j].duration = elements[i][j].w / parentEle.w * parentEle.duration
            }
            elements[i][j].endTime = elements[i][j].startTime + elements[i][j].duration
            if(elements[i][j].children.length){
                elements[i][j].children = setLeftToRightTime(elements[i][j].children, elements[i][j])
            }
        }
    }
    return elements
}