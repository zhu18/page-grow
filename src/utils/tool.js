export function fomatterNum(num) {
    if (typeof num === 'number') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return ''
    }
  }

  /**
   * 解析target, 类名、id、数组(parts配置)
   * @param {*} target 
   * @returns 
   */
export function parseTarget(target){
  if(target.constructor == String) {
    if(target.indexOf('#')> -1) return document.getElementById(target)
    if(target.indexOf('.') > -1){
      let doms = document.getElementsByClassName(target)
      if(doms.length > 1){
          console.warn(`类名为${target}的dom有多个，请确认target参数是否正确！`)
      }
      return doms[0]
    }
  }


  return target
}

export function rangRandom(min = 0, max = 1){
  let num = Math.random() * (max - min) + min
  return num.toFixed(1) - 0
}
