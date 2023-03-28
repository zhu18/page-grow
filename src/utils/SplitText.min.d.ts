// declare namespace SplitText{
//     const aa: string
// }
// export as namespace SplitText
// export = SplitText


// declare const SplitText: object

// declare module '*/SplitText.min.js'{
//     export const SplitText: void
// }

// declare namespace SplitText{
//     const aa: string
// }

// declare class Greeter {
//     constructor(greeting: string);
//     greeting: string;
//     showGreeting(): void;
//   }

//   export = Greeter



declare type mode = "words" | "chars" | "lines";

declare type modes = Array<mode>;

declare interface options{
    type: mode
}

declare class SplitText {
    options: {
        WORDS: mode;
        CHARS: mode;
        LINES: mode;
    };
    words: string[];
    chars: string[];
    lines: string[];
    elements: HTMLElement;
    type: modes;
    constructor(element: HTMLElement, options: options);
    splitWords(element: any): any[];
    splitChars(element: any): any[];
    searchTextNode(element: HTMLElement): string[];
    init(): void;
}
export default SplitText;
  

