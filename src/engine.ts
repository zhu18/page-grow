import type {IDisposable, IGrowElement, IGrowHTMLElement} from './common'
import {IParserRule, RuleFactory, EGrowType}  from './rule'
import  {HTMLPageParser}  from './parser'
import  {HTMLGrowAnimateController, GrowTimeLine}  from './animate'
import { gsap} from "gsap";

export  interface PageGrowOption{
    target:any, // 动画对象
    growType:EGrowType, //动画类型
    interval: number, // 块之间动画间隔
    stringType: string, //文本动画类型
    numberType: string,//数字动画类型
    bgType: string,//背景动画类型
    imageType: string,//图片动画类型
    svgType: string,//svg动画类型
    canvasType: string,//canvas动画类型
    videoType: string,//video动画类型
    leafNodeType: string, //叶子节点动画类型
    customTl: Array<CustomTl>, //自定义动画
    anovSimpleMode: boolean, //是否基于anov使用简单模式
    parseLayer: number, //解析dom层级
}



/**
 * 自定义动画对象
 */
export interface CustomTl{
    target: any, //动画对象
    tl: GrowTimeLine //自定义该动画对象时间线
}

export interface EffectObj{
    id: string, //动画效果名称
    animate: string, //'from'、'fromTo'、'to'
    props: object, //动画属性
    props2: object,  //动画属性,若该属性存在则为fromTo的终止动画属性
    // callback: (target: HTMLElement, config: any) => {}, //动画效果回调函数
}

export class PageGrow{

    public option:PageGrowOption
    private _animateController:HTMLGrowAnimateController

    constructor(opt:PageGrowOption){
        // 设置默认参数
        this.option = {
            target: opt?.target??document.body,
            growType: opt?.growType??3,
            interval: opt?.interval??0.2,
            stringType: opt?.stringType?? 'sys_stringWave',
            numberType: opt?.numberType??'sys_number',
            bgType: opt?.bgType??'sys_scale',
            imageType: opt?.imageType??'sys_scale',
            svgType: opt?.svgType??'sys_scale',
            canvasType: opt?.canvasType??'sys_scale',
            videoType: opt?.videoType??'sys_scale',
            leafNodeType: opt?.leafNodeType??'sys_scale',
            customTl: [],
            anovSimpleMode: opt?.anovSimpleMode??false,
            parseLayer: opt?.parseLayer??0,
        }
        //配置解析规则
        // const rule:IParserRule = RuleFactory.create({growType:<EGrowType>Number(opt.growType)})
        const rule:IParserRule = RuleFactory.create(this.option)
        //构建解析器
        const parser:HTMLPageParser = new HTMLPageParser(rule)
        //开始解析
        const els:Array<IGrowHTMLElement> = parser.parse(this.option)
        //对象列表按类型预定动画方案
        this._animateController=new HTMLGrowAnimateController(els, this.option)
      
    }

    
    public enter():void{
        let tl = this.creatTl()
        if(tl.duration() - 0 > 0){
            //执行进场
            tl.play()
        }else {
            console.log(`the timeline can not paly`)
        }
        
    }

    public leave():void{
        this._animateController.leave()
    }

    public stop():void{
        this._animateController.stop()
    }
    public creatTl():GrowTimeLine{
        let tl = this._animateController.creatTl()
        return tl
    }

    public addEffect(effectList:Array<EffectObj>):void{
        this._animateController.addEffect(effectList)
    }
}

export {gsap} from 'gsap'

