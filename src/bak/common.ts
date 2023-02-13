/**
 * Define an interface for all classes that will hold resources
 */
 export declare interface IDisposable {
    /**
     * Releases all held resources
     */
    dispose(): void;
}

/**
 * 动画元素类型
 */
export declare enum GrowElementType{
    number,
    string,    
    image,
    chart,
    line,
}

export declare interface IBaseElement<T>{   
    x:number
    y:number
    w:number
    h:number
    el:T
}

export declare interface IGrowHTMLElement<T> extends IBaseElement<T>{
    index:number
    tagName:string    
    type:GrowElementType
}

