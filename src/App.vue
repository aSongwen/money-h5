<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted:function(){
    this.is_weixn()
    //禁止微信分享
    this.onBridgeReady()
  },
  methods:{
    is_weixn() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        console.log("yes")
      } else {
        console.log("no")
        //限制访问页面
      this.$router.push({name:"IsWeixin"})
      }
    },
    onBridgeReady(){
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
    }

  }
}
</script>

<style lang="less">
  @import "style/mixin.less";
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: @bgmBlue;
  overflow-x: hidden;
    width:100vw;
}
</style>
