import type {IGrowHTMLElement} from './common'
import  {pageGrowGsap} from './common'
import {IParserRule, RuleFactory, EGrowType}  from './rule'
import  {HTMLPageParser}  from './parser'
import  {HTMLGrowAnimateController, GrowTimeLine, isTl}  from './animate'
import {defaultConfig} from './config.js'
import {parseTarget, rangRandom} from './utils/tool'

export interface PageGrowOption{
    target: string | HTMLElement | Array<object>, // 动画对象,支持类名、id、dom对象、配置文件(类似于dev parts.js)
    growType:EGrowType, //动画类型
    interval: number, // 块之间动画间隔d
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
    adjustTlDur?: true,
    parts?: [], //传入json配置项
    labels?:  Labels,
    reversedCallback: Callback,
    completeCallback: Callback,
}

interface initOption{
    type: number,
    target: string | HTMLElement | Array<object>,
    adjustTlDur?: true,
    parseLayer?: number,
    interval?: number,
    config?: any,
    labels?: Labels,
    tls?: Array<{id: String, tl: gsap.core.Animation}>,
    reversedCallback: Callback,
    completeCallback: Callback,

}

//定义labels
interface Labels{
    [key: string]: string|number
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
        let config = this._parseOption(option), adjustTlDur
        if('adjustTlDur' in opt) {
            adjustTlDur = opt.adjustTlDur
        }else {
            adjustTlDur = true
        }
        return {
            target,
            adjustTlDur: adjustTlDur,
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
        let config:any = {}, growType: EGrowType = 2,  hasMatchType = false
        
        defaultConfig.forEach(item => {
            if(item.type == Number(opt.type)){
                hasMatchType = true
                config = item.config
                growType = item.growType || Number(item.config.growType)
            }
        })
        //未匹配到type,则设置为2
        if(!hasMatchType) {
            console.warn('未匹配到传入的动画类型,默认设置为type=2！请参考https://www.npmjs.com/package/page-grow')
            let type = 2
            defaultConfig.forEach(item => {
                if(item.type === type) 
                config =  item.config
            })
        }
        //opt.parseLayer存在
        if(opt && 'parseLayer' in opt){
            let parseLayer = opt.parseLayer! - 0
            if(isNaN(parseLayer)){
                console.warn("请传入正确的parseLayer参数！请参考https://www.npmjs.com/package/page-grow'")    
            }else {
                config.parseLayer = parseLayer
            }
        }
        //opt.interval
        if(opt && 'interval' in opt){
            let interval = opt.interval! - 0
            if(isNaN(interval)){
                console.warn("请传入正确的interval参数！请参考https://www.npmjs.com/package/page-grow'")    
            }else {
                config.interval = interval
            }
        }
        //opt.config.parseLayer存在
        let optConfig = {...opt.config}
        if(optConfig && 'parseLayer' in optConfig){
            optConfig.parseLayer = optConfig.parseLayer - 0
            if(isNaN(optConfig.parseLayer)){
                console.warn("请传入正确的parseLayer参数！请参考https://www.npmjs.com/package/page-grow'")    
                optConfig.parseLayer = config.parseLayer
            }
            
        }
        //opt.config.parseLayer存在
     
        if(optConfig && 'interval' in optConfig){
            optConfig.interval = optConfig.interval - 0
            if(isNaN(optConfig.interval)){
                console.warn("请传入正确的interval参数！请参考https://www.npmjs.com/package/page-grow'")    
                optConfig.interval = config.interval
            }
        }
        //parseLayer类型转换

        // if(opt.type == 1) return Object.assign({growType}, config, opt.config)
        // if(opt.config?.interval) return {growType, ...config, interval: opt.config?.interval }

        return Object.assign({growType}, config, optConfig )

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
        
        //是否开启动画线时长调整
        if(this.option.adjustTlDur){
            if(tl && (tl?.duration() - 0 > 5 ) ){
                tl?.duration(rangRandom(4, 5))
            }
            // 判断动画对象个数
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
    gsap: pageGrowGsap,
    option: {},
    config: defaultConfig,
    tl: pageGrowGsap.timeline(),
    els: [] as Array<IGrowHTMLElement>,
    init(opt:initOption){
        if(!opt.target) {
            console.warn('请传入动画对象!')
            return 
        }else  if(opt.type === 0){console.warn('传入动画类型为0，需使用自定义动画类型');return }
        else {
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

