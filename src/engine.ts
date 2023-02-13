import type {IDisposable, IGrowElement, IGrowHTMLElement} from './common'
import {IParserRule, RuleOption, RuleFactory, EGrowType}  from './rule'
import  {HTMLPageParser}  from './parser'
import  {HTMLGrowAnimateController}  from './animate'

export  interface PageGrowOption{
    target:any
    growType:EGrowType

}

export class PageGrow{

    private _animateController:HTMLGrowAnimateController

    constructor(opt:PageGrowOption){
        //配置解析规则
        const rule:IParserRule = RuleFactory.create({growType:<EGrowType>Number(opt.growType)})
        //构建解析器
        const parser:HTMLPageParser = new HTMLPageParser(rule)
        //开始解析
        const els:Array<IGrowHTMLElement> = parser.parse(opt.target)
        //对象列表按类型预定动画方案
        this._animateController=new HTMLGrowAnimateController(els)
      
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

