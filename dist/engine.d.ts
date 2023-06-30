import type { IGrowHTMLElement } from './common';
import { EGrowType } from './rule';
import { GrowTimeLine } from './animate';
export interface PageGrowOption {
    target: string | HTMLElement | Array<object>;
    growType: EGrowType;
    interval: number;
    stringType: string;
    numberType: string;
    bgType: string;
    imageType: string;
    svgType: string;
    canvasType: string;
    videoType: string;
    chartType: string;
    leafNodeType: string;
    customTl: Array<CustomTl>;
    anovSimpleMode: boolean;
    parseLayer: number;
    tls: Array<{
        id: String;
        tl: gsap.core.Animation;
    }>;
    parts?: [];
    labels?: {};
    reversedCallback: Callback;
    completeCallback: Callback;
}
interface initOption {
    type: number;
    target: string | HTMLElement | Array<object>;
    config?: object;
    labels?: object;
    tls?: Array<{
        id: String;
        tl: gsap.core.Animation;
    }>;
    reversedCallback: Callback;
    completeCallback: Callback;
}
type Callback = () => void;
/**
 * 自定义动画对象
 */
interface CustomTl {
    target: any;
    tl: GrowTimeLine;
}
export interface EffectObj {
    id: string;
    animate: string;
    props: object;
    props2: object;
}
declare const pageGrow: {
    gsap: typeof globalThis.gsap;
    option: {};
    config: ({
        type: number;
        name: string;
        config: {
            growType: EGrowType;
            interval: number;
            bgType: string;
            stringType: string;
            numberType: string;
            imageType: string;
            svgType: string;
            canvasType: string;
            videoType: string;
            chartType: string;
            anovSimpleMode: boolean;
            parseLayer: number;
            leafNodeType: string;
        };
        des?: undefined;
        growType?: undefined;
        target?: undefined;
    } | {
        type: number;
        name: string;
        des: string;
        growType: EGrowType;
        target: string;
        config: {
            interval: number;
            bgType: string;
            stringType: string;
            numberType: string;
            imageType: string;
            svgType: string;
            canvasType: string;
            videoType: string;
            chartType: string;
            anovSimpleMode: boolean;
            parseLayer: number;
            leafNodeType: string;
            growType?: undefined;
        };
    })[];
    tl: gsap.core.Timeline;
    els: IGrowHTMLElement[];
    init(opt: initOption): GrowTimeLine | undefined;
    leave(reversedCallback: Function, timeScale: number): void;
    stop(): void;
    play(): void;
};
export { pageGrow };
