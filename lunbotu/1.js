class Component {
    constructor(id,opts = {name,data: []}) {
        this.containner = document.getElementById(id);
        this.options = opts;
        this.containner.innerHTML = this.render(opts.data);
    }
    registerPlugins(...plugins) {
        plugins.forEach(plugin => {
            const pluginContainer = document.createElement('div');
            pluginContainer.className = `.${name}__plugin`;
            pluginContainer.innerHTML = plugin.render(this.options.data);
            this.containner.appendChild(pluginContainer)
            plugin.action(this);
        });
    }
    render(data) {
        return ''
    }
}

class Slider extends Component {
    constructor(id,opts ={ name: 'slider-list',data:[],cycle:3000}) {
        super(id,opts);
        this.items = this.containner.querySelectorAll('.slider-list__item, .slider-list__item--selected');
        this.cycle = opts.cycle || 3000;
        this.slideTo(0)
    }
    render(data) {
        const content = data.map(image =>`
        <li class="slider-list__item">
          <img src="${image}"/>
        </li>    
      `.trim());
       return `<ul>${content.join('')}</ul>`
    }
    // 获取被选择的目标
    getSelectedItem() {
        const selected = this.containner.querySelector('.slider-list__item--selected');
        return selected
    }
    // 获取被选择目标的索引
    getSelectedItemIndex() {
        return Array.from(this.items).indexOf(this.getSelectedItem());
    }

    slideTo(idx) {
        const selected = this.getSelectedItem();
        if(selected) {
            selected.className = 'slider-list__item';
        }

        const item = this.items[idx];
        // 如果当前没被选中，则划过去就被选中了
        if(item) {
            item.className = 'slider-list__item--selected'
        }

        const detail = {index: idx}
        const event = new CustomEvent('slide', {bubbles:true, detail})
        // dispatchEvent为触发此事件的最后一步
        this.containner.dispatchEvent(event)
    }
    // 轮播到下一个
    slideNext() {
        const currentIdx = this.getSelectedItemIndex();
        // 下一个轮播到的索引
        const nextIdx = (currentIdx +1) % this.items.length;
        this.slideTo(nextIdx);
    }

    // 轮播到前一个
    slidePrevious() {
        const currentIdx = this.getSelectedItemIndex();
        const previousIdx = (this.items.length+ currentIdx -1) % this.items.length;
        this.slideTo(previousIdx);
    }

    // 添加事件监听器
    addEventListener(type,handler) {
        this.containner.addEventListener(type,handler);
    }
    start() {
        this.stop();
        this._timer = setInterval(() => this.slideNext(),this.cycle);
    }

}

// 轮播图上的圆圈
const pluginController = {
    render(images) {
        return `
        <div class="slide-list__control">
          ${images.map((image, i) => `
              <span class="slide-list__control-buttons${i === 0 ? '--selected' : ''}"></span>
           `).join('')}
        </div>    
      `.trim();
    },
    action(slider) {
        let controller = slider.containner.querySelector('.slide-list__control')
        if(controller) {
            let buttons = controller.querySelectorAll('.slide-list__control-buttons, .slide-list__control-buttons--selected');
            // 四个圆圈 划过去会有反应
            controller.addEventListener('mouseover',evt => {
                var idx = Array.from(buttons).indexOf(evt.target);
                if (idx >= 0) {
                    slider.slideTo(idx);
                    slider.stop();
                }
            });
            // 鼠标一拿开就继续轮播
            controller.addEventListener('mouseout',evt => {
                slider.start();
            });

            slider.addEventListener('slide', evt => {
                const idx = evt.detail.index;
                let selected = controller.querySelector('.slide-list__control-buttons--selected');
                if(selected) {
                    selected.className = 'slide-list__control-buttons';
                    buttons[idx].className = 'slide-list__control-buttons--selected';
                }
            });
        }
    }
};

const pluginPrevious = {
    render() {
        return `<a class="slide-list__previous"></a>`;
    },
    action(slider) {
        let previous = slider.container.querySelector('.slide-list__previous');
        if (previous) {
          previous.addEventListener('click', evt => {
            slider.stop();
            slider.slidePrevious();
            slider.start();
            // preventDefault取消事件的默认动作
            // 如果此事件没有被显式处理，它默认的动作也不应该照常执行。此事件还是继续传播，除非碰到事件侦听器调用
            evt.preventDefault();
          });
        }
      }
}

const pluginNext = {
    render() {
        return `<a class="slide-list__next"></a>`;
    },
    action(slider) {
        let previous = slider.container.querySelector('.slide-list__next');
        if (previous) {
            previous.addEventListener('click', evt => {
              slider.stop();
              slider.slideNext();
              slider.start();
              evt.preventDefault();
            });
          }
    }
};

const slider = new Slider('my-slider', {
    name: 'slide-list', data: ['https://p5.ssl.qhimg.com/t0119c74624763dd070.png',
      'https://p4.ssl.qhimg.com/t01adbe3351db853eb3.jpg',
      'https://p2.ssl.qhimg.com/t01645cd5ba0c3b60cb.jpg',
      'https://p4.ssl.qhimg.com/t01331ac159b58f5478.jpg'], cycle: 3000
  });

// 注册插件
  slider.registerPlugins(pluginController, pluginPrevious, pluginNext);
slider.start();
