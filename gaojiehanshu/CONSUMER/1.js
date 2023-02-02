function iterative(fn) {
    return function(subject, ...rest) {
      if(isIterable(subject)) {
        const ret = [];
        for(let obj of subject) {
          ret.push(fn.apply(this, [obj, ...rest]));
        }
        return ret;
      }
      return fn.apply(this, [subject, ...rest]);
    }
  }