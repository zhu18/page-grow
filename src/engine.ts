import type {IGrowHTMLElement} from './common'
import  {gsap} from './common'
import {IParserRule, RuleFactory, EGrowType}  from './rule'
import  {HTMLPageParser}  from './parser'
import  {HTMLGrowAnimateController, GrowTimeLine, isTl}  from './animate'
import {defaultConfig} from './config.js'
import {parseTarget, rangRandom} from './utils/tool'

export interface PageGrowOption{
    target: string | HTMLElement | Array<object>, // 动画对象,支持类名、id、dom对象、配置文件(类似于dev parts.js)
    growType:EGrowType, //动画类型
    interval: number, // 块之间动画间隔
    stringType: string, //文本动画类型
    numberType: string,//数字动画类型
    bgType: string,//背景动画类型
    imageType: string,//图片动画类型
    svgType: string,//svg动画类型
    canvasType: string,//canvas动画类型
    videoType: string,//video动画类型
    chartType: string, //chart元素动画类型
    leafNodeType: string, //叶子节点动画类型
    customTl: Array<CustomTl>, //自定义动画
    anovSimpleMode: boolean, //是否基于anov使用简单模式
    parseLayer: number, //解析dom层级
    tls: Array<{id: String, tl: gsap.core.Animation}>, //传入子组件动画线及动画对象
    parts?: [], //传入json配置项
    labels?: {},
    reversedCallback: Callback,
    completeCallback: Callback,
}

interface initOption{
    type: number,
    target: string | HTMLElement | Array<object>,
    config?: object,
    labels?: object,
    tls?: Array<{id: String, tl: gsap.core.Animation}>,
    reversedCallback: Callback,
    completeCallback: Callback,

}

type Callback = () => void

/**
 * 自定义动画对象
 */
interface CustomTl{
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

class PageGrow{

    public option:PageGrowOption
    public _animateController:HTMLGrowAnimateController

    constructor(opt:initOption){
        
        // 设置默认参数
        this.option = this._initOption(opt)
        //配置解析规则
        // const rule:IParserRule = RuleFactory.create({growType:<EGrowType>Number(opt.growType)})
        const rule:IParserRule = RuleFactory.create(this.option)
        //构建解析器
        const parser = new HTMLPageParser(rule)
        //开始解析
        const els:Array<IGrowHTMLElement> = parser.parse(this.option)
        //对象列表按类型预定动画方案
        this._animateController=new HTMLGrowAnimateController(els, this.option)
    }

    /**
     * 初始化参数
     * @param opt 
     * @returns 
     */
    private _initOption(opt: any): any{
        let defaultOpt = {
            type: 2
        },option: initOption
        
        if(opt && !opt.type) {
            option = {...opt, ...defaultOpt}
        }else {
            option = {...opt}
        }
        let target = parseTarget(option?.target)
        let config = this._parseOption(option)
        return {
            target,
            ...config,
            tls: option?.tls || Array<{id: String, tl: gsap.core.Animation}>,
            labels: option?.labels || {},
            reversedCallback: option.reversedCallback,
            completeCallback: option.completeCallback,

        }
    }

    /**
     * 参数解析
     * @param opt 
     * @returns 
     */
    private _parseOption(opt: initOption){
        let config:object = {}, growType: EGrowType = 2

        defaultConfig.forEach(item => {
            if(item.type == opt.type){
                config = item.config
                growType = item.growType || item.config.growType
            }
        })
        // if(opt.type == 1) return Object.assign({growType}, config, opt.config)
        // if(opt.config?.interval) return {growType, ...config, interval: opt.config?.interval }

        return Object.assign({growType}, config, opt.config)

        return Object.assign({growType}, config)
        
    }
    
    public enter():void{
        let tl = this.creatTl()
        if(tl && tl?.duration() > 0){
            //执行进场
            tl?.play()
        }else {
            console.log(`the timeline can not paly`)
        }
        
    }

    public leave():void{
        this._animateController?.leave()
    }

    public stop():void{
        this._animateController?.stop()
    }
    public creatTl():GrowTimeLine|undefined{
        let tl = this._animateController?.creatTl()
        if(tl && (tl?.duration() - 0 > 5 ) ){
            tl?.duration(rangRandom(4, 5))
        }
        if(this.option.target && this.option.target instanceof Array && this.option.target.length){
            if(tl && (tl?.duration() - 0 < 2 ) ){
                tl?.duration(rangRandom(2, 3))
            }
        }
        
        return tl
    }

    public addEffect(effectList:Array<EffectObj>):void{
        this._animateController?.addEffect(effectList)
    }
}

const pageGrow = {
    gsap,
    option: {},
    config: defaultConfig,
    tl: gsap.timeline(),
    els: [] as Array<IGrowHTMLElement>,
    init(opt:initOption){
        if(!opt.target) {
            console.warn('请传入动画对象!')
            return 
        }else {
            pageGrow.tl?.eventCallback("onComplete", () => {
                if(typeof opt.completeCallback == 'function'){
                    opt.completeCallback()
                }
            })
            let pageGrowInstance = new PageGrow({ ...opt })
            pageGrow.option = pageGrowInstance.option!
            let tl = pageGrowInstance.creatTl()
            pageGrow.tl = tl!
            pageGrow.els = pageGrowInstance._animateController._els
            return tl
        }
        
    },
    leave(reversedCallback: Function, timeScale:number){
        pageGrow.tl?.eventCallback("onReverseComplete", () => {
            if(typeof reversedCallback == 'function'){
                reversedCallback()
            }
        })
        if(isTl(pageGrow.tl))  pageGrow.tl.timeScale(timeScale || 2).reverse()
    },
    stop(){
        if(isTl(pageGrow.tl)) pageGrow.tl.pause()
    },
    play(){
        if(isTl(pageGrow.tl))  pageGrow.tl.play()
    }

}
export {pageGrow} 

