

// declare namespace ScrambleTextPlugin{
    
// }
// export as namespace ScrambleTextPlugin
// export = ScrambleTextPlugin

declare namespace ScrambleTextPlugin {
    interface Vars {
      text: string;
      chars?: string;
      speed?: number;
      delimiter?: string;
      tweenLength?: boolean;
      newClass?: string;
      oldClass?: string;
      revealDelay?: number;
      rightToLeft?: boolean;
    }
  }
declare namespace gsap {

    interface TweenVars {
        scrambleText?: string | ScrambleTextPlugin.Vars;
    }
}

declare namespace gsap.plugins {
    interface ScrambleTextPlugin extends Plugin {
        
    }
}

declare const ScrambleTextPlugin: gsap.plugins.ScrambleTextPlugin;

export as namespace ScrambleTextPlugin
export = ScrambleTextPlugin
  