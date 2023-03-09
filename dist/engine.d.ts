import { EGrowType } from './rule';
export interface PageGrowOption {
    target: any;
    growType: EGrowType;
    duration: number;
}
export declare class PageGrow {
    private _animateController;
    constructor(opt: PageGrowOption);
    enter(): void;
    leave(): void;
    stop(): void;
}
