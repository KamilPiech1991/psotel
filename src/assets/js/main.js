/*!
 * Glide.js v3.2.0
 * (c) 2013-2018 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */
if (document.querySelector('.glide')) {
	!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.Glide=e()}(this,function(){"use strict";var s={type:"slider",startAt:0,perView:1,focusAt:0,gap:10,autoplay:!1,hoverpause:!0,keyboard:!0,bound:!1,swipeThreshold:80,dragThreshold:120,perTouch:!1,touchRatio:.5,touchAngle:45,animationDuration:400,rewind:!0,rewindDuration:800,animationTimingFunc:"cubic-bezier(0.165, 0.840, 0.440, 1.000)",throttle:10,direction:"ltr",peek:0,breakpoints:{},classes:{direction:{ltr:"glide--ltr",rtl:"glide--rtl"},slider:"glide--slider",carousel:"glide--carousel",swipeable:"glide--swipeable",dragging:"glide--dragging",cloneSlide:"glide__slide--clone",activeNav:"glide__bullet--active",activeSlide:"glide__slide--active",disabledArrow:"glide__arrow--disabled"}};var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},i=function(){function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}}(),a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};function y(t){return parseInt(t)}function o(t){return"string"==typeof t}function c(t){var e=void 0===t?"undefined":n(t);return"function"===e||"object"===e&&!!t}function l(t){return"function"==typeof t}function f(t){return void 0===t}function r(t){return t.constructor===Array}function v(t,e,n){Object.defineProperty(t,e,n)}var d=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};u(this,e),this.events=t,this.hop=t.hasOwnProperty}return i(e,[{key:"on",value:function(t,e){if(r(t))for(var n=0;n<t.length;n++)this.on(t[n],e);this.hop.call(this.events,t)||(this.events[t]=[]);var i=this.events[t].push(e)-1;return{remove:function(){delete this.events[t][i]}}}},{key:"emit",value:function(t,e){if(r(t))for(var n=0;n<t.length;n++)this.emit(t[n],e);this.hop.call(this.events,t)&&this.events[t].forEach(function(t){t(e||{})})}}]),e}(),h=function(){function o(t){var e,n,i,r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};u(this,o),this._c={},this._t=[],this._e=new d,this.disabled=!1,this.selector=t,this.settings=(i=a({},e=s,n=r),n.hasOwnProperty("classes")&&(i.classes=a({},e.classes,n.classes),n.classes.hasOwnProperty("direction")&&(i.classes.direction=a({},e.classes.direction,n.classes.direction))),i),this.index=this.settings.startAt}return i(o,[{key:"mount",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return this._e.emit("mount.before"),c(t)&&(this._c=function(t,e,n){var i={};for(var r in e)l(e[r])&&(i[r]=e[r](t,i,n));for(var o in i)l(i[o].mount)&&i[o].mount();return i}(this,t,this._e)),this._e.emit("mount.after"),this}},{key:"mutate",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return r(t)&&(this._t=t),this}},{key:"update",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return this.settings=a({},this.settings,t),t.hasOwnProperty("startAt")&&(this.index=t.startAt),this._e.emit("update"),this}},{key:"go",value:function(t){return this._c.Run.make(t),this}},{key:"move",value:function(t){return this._c.Transition.disable(),this._c.Move.make(t),this}},{key:"destroy",value:function(){return this._e.emit("destroy"),this}},{key:"play",value:function(){var t=0<arguments.length&&void 0!==arguments[0]&&arguments[0];return t&&(this.settings.autoplay=t),this._e.emit("play"),this}},{key:"pause",value:function(){return this._e.emit("pause"),this}},{key:"disable",value:function(){return this.disabled=!0,this}},{key:"enable",value:function(){return this.disabled=!1,this}},{key:"on",value:function(t,e){return this._e.on(t,e),this}},{key:"isType",value:function(t){return this.settings.type===t}},{key:"settings",get:function(){return this._o},set:function(t){c(t)&&(this._o=t)}},{key:"index",get:function(){return this._i},set:function(t){this._i=y(t)}},{key:"type",get:function(){return this.settings.type}},{key:"disabled",get:function(){return this._d},set:function(t){this._d=!!t}}]),o}();function p(){return(new Date).getTime()}function b(n,i,r){var o=void 0,s=void 0,u=void 0,a=void 0,c=0;r||(r={});var l=function(){c=!1===r.leading?0:p(),o=null,a=n.apply(s,u),o||(s=u=null)},t=function(){var t=p();c||!1!==r.leading||(c=t);var e=i-(t-c);return s=this,u=arguments,e<=0||i<e?(o&&(clearTimeout(o),o=null),c=t,a=n.apply(s,u),o||(s=u=null)):o||!1===r.trailing||(o=setTimeout(l,e)),a};return t.cancel=function(){clearTimeout(o),c=0,o=s=u=null},t}var m={ltr:["marginLeft","marginRight"],rtl:["marginRight","marginLeft"]};function g(t){for(var e=t.parentNode.firstChild,n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}function w(t){return!!(t&&t instanceof window.HTMLElement)}var _='[data-glide-el="track"]';var k=function(){function e(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};u(this,e),this.listeners=t}return i(e,[{key:"on",value:function(t,e,n){var i=3<arguments.length&&void 0!==arguments[3]&&arguments[3];o(t)&&(t=[t]);for(var r=0;r<t.length;r++)this.listeners[t[r]]=n,e.addEventListener(t[r],this.listeners[t[r]],i)}},{key:"off",value:function(t,e){o(t)&&(t=[t]);for(var n=0;n<t.length;n++)e.removeEventListener(t[n],this.listeners[t[n]],!1)}},{key:"destroy",value:function(){delete this.listeners}}]),e}();var S=["ltr","rtl"],H={">":"<","<":">","=":"="};function t(t,e){return{modify:function(t){return e.Direction.is("rtl")?-t:t}}}function T(i,r,o){var s=[function(e,n){return{modify:function(t){return t+n.Gaps.value*e.index}}},function(t,e){return{modify:function(t){return t+e.Clones.grow/2}}},function(n,i){return{modify:function(t){if(0<=n.settings.focusAt){var e=i.Peek.value;return c(e)?t-e.before:t-e}return t}}},function(o,s){return{modify:function(t){var e=s.Gaps.value,n=s.Sizes.width,i=o.settings.focusAt,r=s.Sizes.slideWidth;return"center"===i?t-(n/2-r/2):t-r*i-e*i}}}].concat(i._t,[t]);return{mutate:function(t){for(var e=0;e<s.length;e++){var n=s[e];l(n)&&l(n().modify)&&(t=n(i,r,o).modify(t))}return t}}}var x=["touchstart","mousedown"],A=["touchmove","mousemove"],O=["touchend","touchcancel","mouseup","mouseleave"],C=["mousedown","mousemove","mouseup","mouseleave"];function M(t){return c(t)?(n=t,Object.keys(n).sort().reduce(function(t,e){return t[e]=n[e],t[e],t},{})):{};var n}var z={Html:function(e,t){var n={mount:function(){this.root=e.selector,this.track=this.root.querySelector(_),this.slides=Array.prototype.slice.call(this.wrapper.children).filter(function(t){return!t.classList.contains(e.settings.classes.cloneSlide)})}};return v(n,"root",{get:function(){return n._r},set:function(t){o(t)&&(t=document.querySelector(t)),w(t)&&(n._r=t)}}),v(n,"track",{get:function(){return n._t},set:function(t){w(t)&&(n._t=t)}}),v(n,"wrapper",{get:function(){return n.track.children[0]}}),n},Translate:function(r,o,s){var u={set:function(t){var e=T(r,o).mutate(t);o.Html.wrapper.style.transform="translate3d("+-1*e+"px, 0px, 0px)"},remove:function(){o.Html.wrapper.style.transform=""}};return s.on("move",function(t){var e=o.Gaps.value,n=o.Sizes.length,i=o.Sizes.slideWidth;return r.isType("carousel")&&o.Run.isOffset("<")?(o.Transition.after(function(){s.emit("translate.jump"),u.set(i*(n-1))}),u.set(-i-e*n)):r.isType("carousel")&&o.Run.isOffset(">")?(o.Transition.after(function(){s.emit("translate.jump"),u.set(0)}),u.set(i*n+e*n)):u.set(t.movement)}),s.on("destroy",function(){u.remove()}),u},Transition:function(n,e,t){var i=!1,r={compose:function(t){var e=n.settings;return i?t+" 0ms "+e.animationTimingFunc:t+" "+this.duration+"ms "+e.animationTimingFunc},set:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"transform";e.Html.wrapper.style.transition=this.compose(t)},remove:function(){e.Html.wrapper.style.transition=""},after:function(t){setTimeout(function(){t()},this.duration)},enable:function(){i=!1,this.set()},disable:function(){i=!0,this.set()}};return v(r,"duration",{get:function(){var t=n.settings;return n.isType("slider")&&e.Run.offset?t.rewindDuration:t.animationDuration}}),t.on("move",function(){r.set()}),t.on(["build.before","resize","translate.jump"],function(){r.disable()}),t.on("run",function(){r.enable()}),t.on("destroy",function(){r.remove()}),r},Direction:function(t,e,n){var i={mount:function(){this.value=t.settings.direction},resolve:function(t){var e=t.slice(0,1);return this.is("rtl")?t.split(e).join(H[e]):t},is:function(t){return this.value===t},addClass:function(){e.Html.root.classList.add(t.settings.classes.direction[this.value])},removeClass:function(){e.Html.root.classList.remove(t.settings.classes.direction[this.value])}};return v(i,"value",{get:function(){return i._v},set:function(t){-1<S.indexOf(t)&&(i._v=t)}}),n.on(["destroy","update"],function(){i.removeClass()}),n.on("update",function(){i.mount()}),n.on(["build.before","update"],function(){i.addClass()}),i},Peek:function(n,t,e){var i={mount:function(){this.value=n.settings.peek}};return v(i,"value",{get:function(){return i._v},set:function(t){c(t)?(t.before=y(t.before),t.after=y(t.after)):t=y(t),i._v=t}}),v(i,"reductor",{get:function(){var t=i.value,e=n.settings.perView;return c(t)?t.before/e+t.after/e:2*t/e}}),e.on(["resize","update"],function(){i.mount()}),i},Sizes:function(t,n,e){var i={setupSlides:function(){for(var t=n.Html.slides,e=0;e<t.length;e++)t[e].style.width=this.slideWidth+"px"},setupWrapper:function(t){n.Html.wrapper.style.width=this.wrapperSize+"px"},remove:function(){for(var t=n.Html.slides,e=0;e<t.length;e++)t[e].style.width="";n.Html.wrapper.style.width=""}};return v(i,"length",{get:function(){return n.Html.slides.length}}),v(i,"width",{get:function(){return n.Html.root.offsetWidth}}),v(i,"wrapperSize",{get:function(){return i.slideWidth*i.length+n.Gaps.grow+n.Clones.grow}}),v(i,"slideWidth",{get:function(){return i.width/t.settings.perView-n.Peek.reductor-n.Gaps.reductor}}),e.on(["build.before","resize","update"],function(){i.setupSlides(),i.setupWrapper()}),e.on("destroy",function(){i.remove()}),i},Gaps:function(e,o,t){var n={mount:function(){this.value=e.settings.gap},apply:function(t){for(var e=0,n=t.length;e<n;e++){var i=t[e].style,r=o.Direction.value;i[m[r][0]]=0!==e?this.value/2+"px":"",e!==t.length-1?i[m[r][1]]=this.value/2+"px":i[m[r][1]]=""}},remove:function(t){for(var e=0,n=t.length;e<n;e++){var i=t[e].style;i.marginLeft="",i.marginRight=""}}};return v(n,"value",{get:function(){return n._v},set:function(t){n._v=y(t)}}),v(n,"grow",{get:function(){return n.value*(o.Sizes.length-1)}}),v(n,"reductor",{get:function(){var t=e.settings.perView;return n.value*(t-1)/t}}),t.on("update",function(){n.mount()}),t.on(["build.after","update"],b(function(){n.apply(o.Html.wrapper.children)},30)),t.on("destroy",function(){n.remove(o.Html.wrapper.children)}),n},Move:function(t,n,i){var e={mount:function(){this._o=0},make:function(){var t=this,e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;this.offset=e,i.emit("move",{movement:this.value}),n.Transition.after(function(){i.emit("move.after",{movement:t.value})})}};return v(e,"offset",{get:function(){return e._o},set:function(t){e._o=f(t)?0:y(t)}}),v(e,"translate",{get:function(){return n.Sizes.slideWidth*t.index}}),v(e,"value",{get:function(){var t=this.offset,e=this.translate;return n.Direction.is("rtl")?e+t:e-t}}),i.on(["build.before","run"],function(){e.make()}),e},Clones:function(d,h,t){var e={mount:function(){this.items=[],d.isType("carousel")&&(this.items=this.collect())},collect:function(){for(var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[],e=h.Html.slides,n=d.settings,i=n.perView,r=n.classes,o=e.slice(0,i),s=e.slice(-i),u=0;u<Math.max(1,Math.floor(i/e.length));u++){for(var a=0;a<o.length;a++){var c=o[a].cloneNode(!0);c.classList.add(r.cloneSlide),t.push(c)}for(var l=0;l<s.length;l++){var f=s[l].cloneNode(!0);f.classList.add(r.cloneSlide),t.unshift(f)}}return t},append:function(){for(var t=this.items,e=h.Html,n=e.wrapper,i=e.slides,r=Math.floor(t.length/2),o=t.slice(0,r).reverse(),s=t.slice(r,t.length),u=0;u<s.length;u++)n.appendChild(s[u]);for(var a=0;a<o.length;a++)n.insertBefore(o[a],i[0]);for(var c=0;c<t.length;c++)t[c].style.width=h.Sizes.slideWidth+"px"},remove:function(){for(var t=this.items,e=0;e<t.length;e++)h.Html.wrapper.removeChild(t[e])}};return v(e,"grow",{get:function(){return(h.Sizes.slideWidth+h.Gaps.value)*e.items.length}}),t.on("update",function(){e.remove(),e.mount(),e.append()}),t.on("build.before",function(){d.isType("carousel")&&e.append()}),t.on("destroy",function(){e.remove()}),e},Resize:function(t,e,n){var i=new k,r={mount:function(){this.bind()},bind:function(){i.on("resize",window,b(function(){n.emit("resize")},t.settings.throttle))},unbind:function(){i.off("resize",window)}};return n.on("destroy",function(){r.unbind(),i.destroy()}),r},Build:function(n,i,t){var e={mount:function(){t.emit("build.before"),this.typeClass(),this.activeClass(),t.emit("build.after")},typeClass:function(){i.Html.root.classList.add(n.settings.classes[n.settings.type])},activeClass:function(){var e=n.settings.classes,t=i.Html.slides[n.index];t.classList.add(e.activeSlide),g(t).forEach(function(t){t.classList.remove(e.activeSlide)})},removeClasses:function(){var e=n.settings.classes;i.Html.root.classList.remove(e[n.settings.type]),i.Html.slides.forEach(function(t){t.classList.remove(e.activeSlide)})}};return t.on(["destroy","update"],function(){e.removeClasses()}),t.on(["resize","update"],function(){e.mount()}),t.on("move.after",function(){e.activeClass()}),e},Run:function(o,n,s){var t={mount:function(){this._o=!1},make:function(t){var e=this;o.disabled||(o.disable(),this.move=t,s.emit("run.before",this.move),this.calculate(),s.emit("run",this.move),n.Transition.after(function(){(e.isOffset("<")||e.isOffset(">"))&&(e._o=!1,s.emit("run.offset",e.move)),s.emit("run.after",e.move),o.enable()}))},calculate:function(){var t=this.move,e=this.length,n=t.steps,i=t.direction,r="number"==typeof y(n)&&0!==y(n);switch(i){case">":">"===n?o.index=e:this.isEnd()?(o.isType("slider")&&!o.settings.rewind||(this._o=!0,o.index=0),s.emit("run.end",t)):r?o.index+=Math.min(e-o.index,-y(n)):o.index++;break;case"<":"<"===n?o.index=0:this.isStart()?(o.isType("slider")&&!o.settings.rewind||(this._o=!0,o.index=e),s.emit("run.start",t)):r?o.index-=Math.min(o.index,y(n)):o.index--;break;case"=":o.index=n}},isStart:function(){return 0===o.index},isEnd:function(){return o.index===this.length},isOffset:function(t){return this._o&&this.move.direction===t}};return v(t,"move",{get:function(){return this._m},set:function(t){this._m={direction:t.substr(0,1),steps:t.substr(1)?t.substr(1):0}}}),v(t,"length",{get:function(){var t=o.settings,e=n.Html.slides.length;return t.perView>e?0:o.isType("slider")&&"center"!==t.focusAt&&t.bound?e-1-(y(t.perView)-1)+y(t.focusAt):e-1}}),v(t,"offset",{get:function(){return this._o}}),t},Swipe:function(d,h,v){var n=new k,p=0,m=0,g=0,i=!1,t={mount:function(){this.bindSwipeStart()},start:function(t){if(!i&&!d.disabled){this.disable();var e=this.touches(t);p=null,m=y(e.pageX),g=y(e.pageY),this.bindSwipeMove(),this.bindSwipeEnd(),v.emit("swipe.start")}},move:function(t){if(!d.disabled){var e=d.settings,n=e.touchAngle,i=e.touchRatio,r=e.classes,o=this.touches(t),s=y(o.pageX)-m,u=y(o.pageY)-g,a=Math.abs(s<<2),c=Math.abs(u<<2),l=(a+c)*(a+c),f=c*c;if(p=Math.asin(f/l),h.Move.make(s*parseFloat(i)),!(180*p/Math.PI<n))return!1;t.stopPropagation(),h.Html.root.classList.add(r.dragging),v.emit("swipe.move")}},end:function(t){if(!d.disabled){var e=d.settings,n=this.touches(t),i=this.threshold(t),r=n.pageX-m,o=180*p/Math.PI,s=Math.round(r/h.Sizes.slideWidth);this.enable(),i<r&&o<e.touchAngle?(e.perTouch&&(s=Math.min(s,y(e.perTouch))),h.Direction.is("rtl")&&(s=-s),h.Run.make(h.Direction.resolve("<"+s))):r<-i&&o<e.touchAngle?(e.perTouch&&(s=Math.max(s,-y(e.perTouch))),h.Direction.is("rtl")&&(s=-s),h.Run.make(h.Direction.resolve(">"+s))):h.Move.make(),h.Html.root.classList.remove(e.classes.dragging),this.unbindSwipeMove(),this.unbindSwipeEnd(),v.emit("swipe.end")}},bindSwipeStart:function(){var e=this,t=d.settings;t.swipeThreshold&&n.on(x[0],h.Html.wrapper,function(t){return e.start(t)},{passive:!0}),t.dragThreshold&&n.on(x[1],h.Html.wrapper,function(t){return e.start(t)})},unbindSwipeStart:function(){n.off(x[0],h.Html.wrapper),n.off(x[1],h.Html.wrapper)},bindSwipeMove:function(){var e=this;n.on(A,h.Html.wrapper,b(function(t){return e.move(t)},d.settings.throttle),{passive:!0})},unbindSwipeMove:function(){n.off(A,h.Html.wrapper)},bindSwipeEnd:function(){var e=this;n.on(O,h.Html.wrapper,function(t){return e.end(t)})},unbindSwipeEnd:function(){n.off(O,h.Html.wrapper)},touches:function(t){return-1<C.indexOf(t.type)?t:t.touches[0]||t.changedTouches[0]},threshold:function(t){var e=d.settings;return-1<C.indexOf(t.type)?e.dragThreshold:e.swipeThreshold},enable:function(){return i=!1,h.Transition.enable(),this},disable:function(){return i=!0,h.Transition.disable(),this}};return v.on("build.after",function(){h.Html.root.classList.add(d.settings.classes.swipeable)}),v.on("destroy",function(){t.unbindSwipeStart(),t.unbindSwipeMove(),t.unbindSwipeEnd(),n.destroy()}),t},Images:function(t,e,n){var i=new k,r={mount:function(){this.bind()},bind:function(){i.on("dragstart",e.Html.wrapper,this.dragstart)},unbind:function(){i.off("dragstart",e.Html.wrapper)},dragstart:function(t){t.preventDefault()}};return n.on("destroy",function(){r.unbind(),i.destroy()}),r},Anchors:function(t,e,n){var i=new k,r=!1,o=!1,s={mount:function(){this._a=e.Html.wrapper.querySelectorAll("a"),this.bind()},bind:function(){i.on("click",e.Html.wrapper,this.click)},unbind:function(){i.off("click",e.Html.wrapper)},click:function(t){t.stopPropagation(),o&&t.preventDefault()},detach:function(){if(o=!0,!r){for(var t=0;t<this.items.length;t++)this.items[t].draggable=!1,this.items[t].setAttribute("data-href",this.items[t].getAttribute("href")),this.items[t].removeAttribute("href");r=!0}return this},attach:function(){if(o=!1,r){for(var t=0;t<this.items.length;t++)this.items[t].draggable=!0,this.items[t].setAttribute("href",this.items[t].getAttribute("data-href"));r=!1}return this}};return v(s,"items",{get:function(){return s._a}}),n.on("swipe.move",function(){s.detach()}),n.on("swipe.end",function(){e.Transition.after(function(){s.attach()})}),n.on("destroy",function(){s.attach(),s.unbind(),i.destroy()}),s},Controls:function(i,e,t){var n=new k,r={mount:function(){this._n=e.Html.root.querySelectorAll('[data-glide-el="controls[nav]"]'),this._c=e.Html.root.querySelectorAll('[data-glide-el^="controls"]'),this.addBindings()},setActive:function(){for(var t=0;t<this._n.length;t++)this.addClass(this._n[t].children)},removeActive:function(){for(var t=0;t<this._n.length;t++)this.removeClass(this._n[t].children)},addClass:function(t){var e=i.settings,n=t[i.index];n.classList.add(e.classes.activeNav),g(n).forEach(function(t){t.classList.remove(e.classes.activeNav)})},removeClass:function(t){t[i.index].classList.remove(i.settings.classes.activeNav)},addBindings:function(){for(var t=0;t<this._c.length;t++)this.bind(this._c[t].children)},removeBindings:function(){for(var t=0;t<this._c.length;t++)this.unbind(this._c[t].children)},bind:function(t){for(var e=0;e<t.length;e++)n.on(["click","touchstart"],t[e],this.click)},unbind:function(t){for(var e=0;e<t.length;e++)n.off(["click","touchstart"],t[e])},click:function(t){t.preventDefault(),e.Run.make(e.Direction.resolve(t.currentTarget.getAttribute("data-glide-dir")))}};return v(r,"items",{get:function(){return r._c}}),t.on(["mount.after","move.after"],function(){r.setActive()}),t.on("destroy",function(){r.removeBindings(),r.removeActive(),n.destroy()}),r},Keyboard:function(t,e,n){var i=new k,r={mount:function(){t.settings.keyboard&&this.bind()},bind:function(){i.on("keyup",document,this.press)},unbind:function(){i.off("keyup",document)},press:function(t){39===t.keyCode&&e.Run.make(e.Direction.resolve(">")),37===t.keyCode&&e.Run.make(e.Direction.resolve("<"))}};return n.on(["destroy","update"],function(){r.unbind()}),n.on("update",function(){r.mount()}),n.on("destroy",function(){i.destroy()}),r},Autoplay:function(e,n,t){var i=new k,r={mount:function(){this.start(),e.settings.hoverpause&&this.bind()},start:function(){var t=this;e.settings.autoplay&&f(this._i)&&(this._i=setInterval(function(){t.stop(),n.Run.make(">"),t.start()},this.time))},stop:function(){this._i=clearInterval(this._i)},bind:function(){var t=this;i.on("mouseover",n.Html.root,function(){t.stop()}),i.on("mouseout",n.Html.root,function(){t.start()})},unbind:function(){i.off(["mouseover","mouseout"],n.Html.root)}};return v(r,"time",{get:function(){var t=n.Html.slides[e.index].getAttribute("data-glide-autoplay");return y(t||e.settings.autoplay)}}),t.on(["destroy","update"],function(){r.unbind()}),t.on(["run.before","pause","destroy","swipe.start","update"],function(){r.stop()}),t.on(["run.after","play","swipe.end"],function(){r.start()}),t.on("update",function(){r.mount()}),t.on("destroy",function(){i.destroy()}),r},Breakpoints:function(t,e,n){var i=new k,r=t.settings,o=r.breakpoints;o=M(o);var s=a({},r),u={match:function(t){if(void 0!==window.matchMedia)for(var e in t)if(t.hasOwnProperty(e)&&window.matchMedia("(max-width: "+e+"px)").matches)return t[e];return s}};return a(r,u.match(o)),i.on("resize",window,b(function(){a(r,u.match(o))},t.settings.throttle)),n.on("update",function(){o=M(o),s=a({},r)}),n.on("destroy",function(){i.off("resize",window)}),u}};return function(t){function e(){return u(this,e),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,h),i(e,[{key:"mount",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return function t(e,n,i){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,n);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:t(o,n,i)}if("value"in r)return r.value;var s=r.get;return void 0!==s?s.call(i):void 0}(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"mount",this).call(this,a({},z,t))}}]),e}()});
}



// wait for the entire page to finish loading
window.addEventListener('load', function() {
	
lazyLoad();
	
});

function lazyLoad() {
	var card_images = document.querySelectorAll('.lazy-image');
	
// loop over each card image
	card_images.forEach(function(card_image) {
	var image_url = card_image.getAttribute('data-image-full');
	var content_image = card_image.querySelector('img');
// change the src of the content image to load the new high res photo
	content_image.src = image_url;
// listen for load event when the new photo is finished loading
	content_image.addEventListener('load', function() {
// swap out the visible background image with the new fully downloaded photo
	card_image.style.backgroundImage = 'url(' + image_url + ')';
// add a class to remove the blur filter to smoothly transition the image change
	card_image.className = card_image.className + ' is-loaded';
});
		
	});
	
}

// Sticky nav

let scrollpos = window.scrollY
const header = document.querySelector(".site-header")
const header_height = header.offsetHeight

const add_class_on_scroll = () => header.classList.add("shrink")
const remove_class_on_scroll = () => header.classList.remove("shrink")

window.addEventListener('scroll', function() { 
  scrollpos = window.scrollY

  if (scrollpos >= header_height) { add_class_on_scroll() }
  else { remove_class_on_scroll() }

  console.log(scrollpos)
});

// Mobile nav

    const triggerNav = document.querySelector('.burger');
    const nav = document.querySelector('.main-nav');

    triggerNav.addEventListener('click', () => {
        triggerNav.classList.toggle('active');
        nav.classList.toggle('active');
    });

// Tabs

	const tabs = document.querySelectorAll(".tab");
	const tabContent = document.querySelectorAll(".tab-content");
 
	let tabNo = 0;
	let contentNo = 0;
 
	tabs.forEach((tab) => {
	   tab.dataset.id = tabNo;
	   tabNo++;
	   tab.addEventListener("click", function () {
		  tabs.forEach((tab) => {
			 tab.classList.remove("active");
			 tab.classList.add("non-active");
		  });
		  this.classList.remove("non-active");
		  this.classList.add("active");
		  tabContent.forEach((content) => {
			 content.classList.add("hidden");
			 if (content.dataset.id === tab.dataset.id) {
				content.classList.remove("hidden");
			 }
		  });
	   });
	});
 
	tabContent.forEach((content) => {
	   content.dataset.id = contentNo;
	   contentNo++;
	});

// Accordion
if (document.querySelector(".accordion")) {
	let t = document.getElementsByClassName("accordion");
	  for (let e = 0; e < t.length; e++) t[e].addEventListener("click", function () {
		let e = this.nextElementSibling;
		if (e.style.maxHeight) e.style.maxHeight = null, this.classList.remove("open");
		else {
		  for (let a = 0; a < t.length; a++) t[a].classList.remove("open"), t[a].nextElementSibling.style.maxHeight = null;
		  e.style.maxHeight = e.scrollHeight + "px", this.classList.toggle("open");
		}
	  });
	};
  


    const modal = document.getElementById('myModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    openModalBtn.onclick = function() {
        modal.style.display = "flex";
    }

    closeModalBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    function selectButton(button, group) {
        const buttons = document.querySelectorAll(`#${group}-buttons button`);
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function calculateCost() {
        const sizeButton = document.querySelector('#size-buttons button.active');
        const accommodationButton = document.querySelector('#accommodation-buttons button.active');
        const resultDesc = document.querySelector('.result-desc');
        
        let size, accommodation;

        if (sizeButton) {
            size = sizeButton.value;
        }

        if (accommodationButton) {
            accommodation = accommodationButton.value;
        }

        if (!size || !accommodation) {
            alert('Proszę wybrać wielkość pieska i miejsce zakwaterowania.');
            return;
        }

        const arrivalDate = document.getElementById('arrival').value;
        const arrivalTime = document.getElementById('arrival-time').value;
        const departureDate = document.getElementById('departure').value;
        const departureTime = document.getElementById('departure-time').value;

        if (!arrivalDate || !arrivalTime || !departureDate || !departureTime) {
            alert('Proszę wprowadzić pełne daty i godziny przybycia oraz odbioru.');
            return;
        }

        const arrival = new Date(arrivalDate + 'T' + arrivalTime);
        const departure = new Date(departureDate + 'T' + departureTime);

        if (departure <= arrival) {
            alert('Data i godzina odbioru muszą być późniejsze niż data i godzina przybycia.');
            return;
        }

        const msInDay = 24 * 60 * 60 * 1000;
        let numberOfDays = Math.ceil((departure - arrival) / msInDay);

        let dailyCost;
        if (accommodation === 'box') {
            if (size === 'mały') dailyCost = 60;
            else if (size === 'średni') dailyCost = 70;
            else if (size === 'duży') dailyCost = 80;
        } else if (accommodation === 'pokoj') {
            if (size === 'mały') dailyCost = 80;
            else if (size === 'średni') dailyCost = 90;
            else if (size === 'duży') dailyCost = 100;
        }

  const totalCost = numberOfDays * dailyCost;
        
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = `Koszt pobytu: ${totalCost} PLN`;
        resultDiv.classList.add('show');
        resultDesc.classList.add('show');
    }