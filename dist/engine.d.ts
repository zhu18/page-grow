import { EGrowType } from './rule';
import { GrowTimeLine } from './animate';
import { gsap } from 'gsap';
export { gsap };
export interface PageGrowOption {
    target: string | HTMLElement | Array<object> | null;
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
    tls: Array<object>;
    parts?: [];
    labels?: {};
    reversedCallback: Callback;
    completeCallback: Callback;
}
interface initOption {
    type: number;
    target?: string | HTMLElement | Array<object> | null;
    config?: object;
    labels?: object;
    tls?: Array<object>;
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
    tl: gsap.core.Timeline;
    els: never[];
    init(opt: initOption): GrowTimeLine | undefined;
    leave(reversedCallback: Function, timeScale: number): void;
    stop(): void;
    play(): void;
};
export { pageGrow };
