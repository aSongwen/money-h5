// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueClipboard from 'vue-clipboard2'
import token from './token.js'
import moment from 'moment'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import loading from './utils/loading.js'
import index1 from '../config/index.js'

Vue.use(VueAwesomeSwiper)

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.use(MintUI)
Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.use(token)
Vue.use(loading)
Vue.use(index1)
document.documentElement.style.fontSize = `${document.documentElement.clientWidth / 640 *100}px`;
Vue.prototype.token =token
Vue.prototype.loading =loading
Vue.prototype.index1 =index1
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})


// main.js里面的代码
router.beforeEach((to, from, next) => {

  //禁止微信分享
  function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
  }

  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }

  if(to.path !='/IsWeixin') {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      console.log("yes")
    } else {
      console.log("no")
      //限制访问页面
      router.push({name: "IsWeixin"})
      return
    }
  }
  if(to.path!='/Home' && to.path!='/Task' && to.path!='/Message' && to.path!='/User'){
    var back=document.getElementsByClassName("mintui-back").item(0)
    if(back){
      back.style.visibility="visible"
    }
  }
  /* 路由发生变化修改页面meta */
  if(to.meta.content){
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    head[0].appendChild(meta)
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
    var title=document.getElementById("title_text")
    if(title!=null){
      title=to.meta.title
    }
    //document.getElementsByClassName("mint-header-title").item(0).innerHTML=to.meta.title
  }
  next()
});
