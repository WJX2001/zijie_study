/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟的时间
 */

//  标准防抖
function debounce(fn,wait=2000) {
    var timer=null;

    // 因为要将函数传进来进行防抖,所以还要return 回去一个函数
    return function() {
        // 如果有定时器，就将定时器清除,直到执行到fn这个函数
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            // 通过apply的方式改变this指向问题，来达到透传的效果
            fn.apply(this.arguments)
        },wait)
        
    }
}

// 先触发式防抖
function debounce(fn,wait=2000) {
    var timer=null;

    // 因为要将函数传进来进行防抖,所以还要return 回去一个函数
    return function() {
        // 如果有定时器，就将定时器清除,直到执行到fn这个函数
        if(timer) clearTimeout(timer)
        !timer && fn.apply(this,arguments)
        timer = setTimeout(() => {
            // 通过apply的方式改变this指向问题，来达到透传的效果
            timer=null;
        },wait)
        
    }
}