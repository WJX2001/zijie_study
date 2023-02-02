function throttle(fn, time = 500){
    let timer;
    return function(...args){
      if(timer == null){
        fn.apply(this,  args);
        timer = setTimeout(() => {
          timer = null;
        }, time)
      }
    }
  }
  
  btn.onclick = throttle(function(e){
    circle.innerHTML = parseInt(circle.innerHTML) + 1;
    circle.className = 'fade';
    setTimeout(() => circle.className = '', 250);
  });