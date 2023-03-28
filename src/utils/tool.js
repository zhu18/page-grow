export function fomatterNum(num) {
    if (typeof num === 'number') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return ''
    }
  }
