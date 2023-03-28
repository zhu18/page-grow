import { EGrowType } from './rule';
export interface PageGrowOption {
    target: any;
    growType: EGrowType;
    duration: number;
    stringType: number;
    stringDurationThreshold: number;
    numberType: number;
    numberDurationThreshold: number;
    bgType: number;
    bgDurationThreshold: number;
}
export declare class PageGrow {
    option: PageGrowOption;
    private _animateController;
    constructor(opt: PageGrowOption);
    enter(): void;
    leave(): void;
    stop(): void;
}
