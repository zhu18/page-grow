import type {IDisposable, IGrowElement, IGrowHTMLElement} from './common'
import {IParserRule, RuleOption, RuleFactory, EGrowType}  from './rule'
import  {HTMLPageParser}  from './parser'
import  {HTMLGrowAnimateController}  from './animate'

export  interface PageGrowOption{
    target:any, // 动画对象
    growType:EGrowType, //动画类型
    duration: number, //参考时间，主要用来计算元素动画时长，目前也用来计算元素动画开始时间
    stringType: number, //文本动画类型
    stringDurationThreshold: number, //文本动画时长临界值
    numberType: number,//数字动画类型
    numberDurationThreshold: number,//数字动画时长临界值
    bgType: number,//背景动画类型
    bgDurationThreshold: number//背景动画时长临界值

}

export class PageGrow{

    public option:PageGrowOption
    private _animateController:HTMLGrowAnimateController

    constructor(opt:PageGrowOption){

        // 设置默认参数
        this.option = {
            target: opt.target??document.body,
            growType: opt.growType??3,
            duration: opt.duration??3,
            stringType: opt.stringType??1,
            stringDurationThreshold: opt.stringDurationThreshold ?? 1,
            numberType: opt.numberType??1,
            numberDurationThreshold: opt.numberDurationThreshold ?? 1,
            bgType: opt.stringType??1,
            bgDurationThreshold: opt.bgDurationThreshold ?? 1,
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
        //执行进场
        this._animateController.enter()
    }

    public leave():void{
        this._animateController.leave()
    }

    public stop():void{
        this._animateController.stop()
    }
}

