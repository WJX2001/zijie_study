function times(fn,count=1) {
    return function(...args) {
        if(count >0){
            count --
            return fn.apply(this,args)
        }
    }
}