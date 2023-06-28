

// declare namespace DrawSVGPlugin{
    
// }
// export as namespace DrawSVGPlugin
// export = DrawSVGPlugin

// declare type mode = "words" | "chars" | "lines";

// declare type modes = Array<mode>;

// declare interface options{
//     type: mode
// }

// declare class SplitText {
//     options: {
//         WORDS: mode;
//         CHARS: mode;
//         LINES: mode;
//     };
//     words: string[];
//     chars: string[];
//     lines: string[];
//     elements: HTMLElement;
//     type: modes;
//     constructor(element: HTMLElement, options: options);
//     splitWords(element: any): any[];
//     splitChars(element: any): any[];
//     searchTextNode(element: HTMLElement): string[];
//     init(): void;
// }
// export default SplitText;



declare namespace SplitText {
  interface Vars {
    
  }
}
declare namespace gsap {

  
}

declare namespace gsap.plugins {
  interface SplitText extends Plugin {
      
  }
}

declare const SplitText: gsap.plugins.SplitText;

export as namespace SplitText
export = SplitText